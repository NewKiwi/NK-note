<template>
  <transition name="dialog-fade">
    <div class="k-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div
        class="k-dialog"
        :class="[{ 'is-fullscreen': fullscreen, 'k-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">
        <div class="k-dialog__header">
          <slot name="title">
            <span class="k-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="k-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            <i class="k-dialog__close k-icon k-icon-close"></i>
          </button>
        </div>
        <div class="k-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="k-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from '../../../src/utils/popup'
  import emitter from '../../../src/utils/mixins/emitter'

  export default {
    name: 'KDialog',

    mixins: [Popup, emitter],

    props: {
      title: {
        type: String,
        default: ''
      },

      modal: {
        type: Boolean,
        default: true
      },

      modalAppendToBody: {
        type: Boolean,
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: false
      },

      lockScroll: {
        type: Boolean,
        default: true
      },

      closeOnClickModal: {
        type: Boolean,
        default: true
      },

      closeOnPressEscape: {
        type: Boolean,
        default: true
      },

      showClose: {
        type: Boolean,
        default: true
      },

      width: String,

      fullscreen: Boolean,

      customClass: {
        type: String,
        default: ''
      },

      top: {
        type: String,
        default: '15vh'
      },
      beforeClose: Function,
      center: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        closed: false
      }
    },

    watch: {
      visible(val) {
        if (val) {
          this.closed = false
          this.$emit('open')
          this.$el.addEventListener('scroll', this.updatePopper)
          this.$nextTick(() => {
            this.$refs.dialog.scrollTop = 0
          })
          if (this.appendToBody) {
            document.body.appendChild(this.$el)
          }
        } else {
          this.$el.removeEventListener('scroll', this.updatePopper)
          if (!this.closed) this.$emit('close')
        }
      }
    },

    computed: {
      style() {
        const style = {}
        if (this.width) {
          style.width = this.width
        }
        if (!this.fullscreen) {
          style.marginTop = this.top
        }
        return style
      }
    },

    methods: {
      handleWrapperClick() {
        if (!this.closeOnClickModal) return
        this.handleClose()
      },
      handleClose() {
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(this.hide)
        } else {
          this.hide()
        }
      },
      hide(cancel) {
        if (cancel !== false) {
          this.$emit('update:visible', false)
          this.$emit('close')
          this.closed = true
        }
      }
      // updatePopper() {
      //   this.broadcast('KSelectDropdown', 'updatePopper')
      //   this.broadcast('KDropdownMenu', 'updatePopper')
      // }
    },

    mounted() {
      if (this.visible) {
        this.rendered = true
        this.open()
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      }
    },

    destroyed() {
      // if appendToBody is true, remove DOM node after destroy
      if (this.appendToBody && this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../../../src/styles/_variable.scss';
.k-dialog {
  padding: 32px;
  position: relative;
  margin: 0 auto 50px;
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  box-sizing: border-box;
  width: 50%;
  &.is-fullscreen{
    width: 100%;
    margin-top: 0;
    margin-bottom: 0;
    height: 100%;
    overflow: auto
  }
  &__wrapper{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0
  }
  &__header{
    padding-bottom: 16px;
  }
  &__headerbtn{
    position: absolute;
    top: 22px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 25px;
    & .k-dialog__close{
      color: #000;
    }
    &:focus .k-dialog__close,
    &:hover .k-dialog__close{
      color: $mainColor;
    }
  }
  &__title{
    line-height: 1;
    font-size: 30px;
    color: $mainText;
  }
  &__body{
    color:$mainText;
    line-height: 24px;
    font-size: 14px
  }
  &__footer{
    padding: 10px 20px 20px;
    text-align: right;
    box-sizing: border-box
  }
  &--center{
    text-align: center
  }
  &--center .k-dialog__body{
    text-align: initial;
    padding: 25px 25px 30px
  }
  &--center .k-dialog__footer{
    text-align: inherit
  }
}
</style>

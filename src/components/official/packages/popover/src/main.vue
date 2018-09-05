<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave">
      <div
        class="k-popover k-popper"
        :class="[popperClass, content && 'k-popover--plain']"
        ref="popper"
        v-show="!disabled && showPopper"
        :style="{ width: width + 'px' }"
        role="tooltip"
        :aria-hidden="(disabled || !showPopper) ? 'true' : 'false'"
      >
        <div class="k-popover__title" v-if="title" v-text="title"></div>
        <slot>{{ content }}</slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>
<script>
import Popper from '../../../src/utils/vue-popper'
import { on, off, addClass, removeClass } from '../../../src/utils/dom'

export default {
  name: 'KPopover',

  mixins: [Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    openDelay: {
      type: Number,
      default: 0
    },
    title: String,
    disabled: Boolean,
    content: String,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    }
  },

  watch: {
    showPopper(val) {
      val ? this.$emit('show') : this.$emit('hide')
    }
  },

  mounted() {
    // console.log(this.referenceElm, this.reference, this.$refs.reference)
    let reference = this.referenceElm = this.reference || this.$refs.reference
    const popper = this.popper || this.$refs.popper

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm
    }
    // console.log(reference)
    // 可访问性
    if (reference) {
      addClass(reference, 'k-popover__reference')

      if (this.trigger !== 'click') {
        on(reference, 'focusin', () => {
          this.handleFocus()
          const instance = reference.__vue__
          if (instance && instance.focus) {
            instance.focus()
          }
        })
        on(popper, 'focusin', this.handleFocus)
        on(reference, 'focusout', this.handleBlur)
        on(popper, 'focusout', this.handleBlur)
      }
      on(reference, 'keydown', this.handleKeydown)
      on(reference, 'click', this.handleClick)
    }
    if (this.trigger === 'click') {
      on(reference, 'click', this.doToggle)
      on(document, 'click', this.handleDocumentClick)
    } else if (this.trigger === 'hover') {
      on(reference, 'mouseenter', this.handleMouseEnter)
      on(popper, 'mouseenter', this.handleMouseEnter)
      on(reference, 'mouseleave', this.handleMouseLeave)
      on(popper, 'mouseleave', this.handleMouseLeave)
    } else if (this.trigger === 'focus') {
      let found = false

      if ([].slice.call(reference.children).length) {
        const children = reference.childNodes
        const len = children.length
        for (let i = 0; i < len; i++) {
          if (children[i].nodeName === 'INPUT' ||
              children[i].nodeName === 'TEXTAREA') {
            on(children[i], 'focusin', this.doShow)
            on(children[i], 'focusout', this.doClose)
            found = true
            break
          }
        }
      }
      if (found) return
      if (reference.nodeName === 'INPUT' ||
        reference.nodeName === 'TEXTAREA') {
        on(reference, 'focusin', this.doShow)
        on(reference, 'focusout', this.doClose)
      } else {
        on(reference, 'mousedown', this.doShow)
        on(reference, 'mouseup', this.doClose)
      }
    }
  },

  methods: {
    doToggle() {
      this.showPopper = !this.showPopper
    },
    doShow() {
      this.showPopper = true
    },
    doClose() {
      this.showPopper = false
    },
    handleFocus() {
      addClass(this.referenceElm, 'focusing')
      if (this.trigger !== 'manual') this.showPopper = true
    },
    handleClick() {
      removeClass(this.referenceElm, 'focusing')
    },
    handleBlur() {
      removeClass(this.referenceElm, 'focusing')
      if (this.trigger !== 'manual') this.showPopper = false
    },
    handleMouseEnter() {
      clearTimeout(this._timer)
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = true
        }, this.openDelay)
      } else {
        this.showPopper = true
      }
    },
    handleKeydown(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
        this.doClose()
      }
    },
    handleMouseLeave() {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.showPopper = false
      }, 200)
    },
    handleDocumentClick(e) {
      let reference = this.reference || this.$refs.reference
      const popper = this.popper || this.$refs.popper

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm
      }
      if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)) return
      this.showPopper = false
    },
    handleAfterEnter() {
      this.$emit('after-enter')
    },
    handleAfterLeave() {
      this.$emit('after-leave')
      this.doDestroy()
    }
  },

  destroyed() {
    const reference = this.reference

    off(reference, 'click', this.doToggle)
    off(reference, 'mouseup', this.doClose)
    off(reference, 'mousedown', this.doShow)
    off(reference, 'focusin', this.doShow)
    off(reference, 'focusout', this.doClose)
    off(reference, 'mouseleave', this.handleMouseLeave)
    off(reference, 'mouseenter', this.handleMouseEnter)
    off(document, 'click', this.handleDocumentClick)
  }
}
</script>

<style lang="scss">
  .k-popover{
    border-radius: 4px;
    position: absolute;
    background: #fff;
    min-width: 150px;
    border: 1px solid #ebeef5;
    padding: 12px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    &:focus,
    &:focus:active,
    &__reference:focus:hover,
    &__reference:focus:not(.focusing) {
      outline-width: 0
    }
    &--plain{
      padding: 18px 20px
    }
    &__title{
      color: #303133;
      font-size: 16px;
      line-height: 1;
      margin-bottom: 12px
    }
    & .popper__arrow,
    & .popper__arrow::after {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid
    }

    & .popper__arrow {
        border-width: 6px;
        -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03))
    }

    & .popper__arrow::after {
        content: " ";
        border-width: 6px
    }

    &[x-placement^=top] {
        margin-bottom: 12px
    }

    &[x-placement^=top] .popper__arrow {
        bottom: -6px;
        left: 50%;
        margin-right: 3px;
        border-top-color: #ebeef5;
        border-bottom-width: 0
    }

    &[x-placement^=top] .popper__arrow::after {
        bottom: 1px;
        margin-left: -6px;
        border-top-color: #fff;
        border-bottom-width: 0
    }

    &[x-placement^=bottom] {
        margin-top: 12px
    }

    &[x-placement^=bottom] .popper__arrow {
        top: -6px;
        left: 50%;
        margin-right: 3px;
        border-top-width: 0;
        border-bottom-color: #ebeef5
    }

    &[x-placement^=bottom] .popper__arrow::after {
        top: 1px;
        margin-left: -6px;
        border-top-width: 0;
        border-bottom-color: #fff
    }

    &[x-placement^=right] {
        margin-left: 12px
    }

    &[x-placement^=right] .popper__arrow {
        top: 50%;
        left: -6px;
        margin-bottom: 3px;
        border-right-color: #ebeef5;
        border-left-width: 0
    }

    &[x-placement^=right] .popper__arrow::after {
        bottom: -6px;
        left: 1px;
        border-right-color: #fff;
        border-left-width: 0
    }

    &[x-placement^=left] {
        margin-right: 12px
    }

    &[x-placement^=left] .popper__arrow {
        top: 50%;
        right: -6px;
        margin-bottom: 3px;
        border-right-width: 0;
        border-left-color: #ebeef5
    }

    &[x-placement^=left] .popper__arrow::after {
        right: 1px;
        bottom: -6px;
        margin-left: -6px;
        border-right-width: 0;
        border-left-color: #fff
    }
  }
</style>

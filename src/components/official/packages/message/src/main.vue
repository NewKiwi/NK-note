<template>
  <transition name="k-message-fade">
    <div
      :class="[
        'k-message',
        type && !iconClass ? `k-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass]"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="k-message__content">{{ message }}</p>
        <p v-else v-html="message" class="k-message__content"></p>
      </slot>
      <i v-if="showClose" class="k-message__closeBtn k-icon-close" @click="close"></i>
    </div>
  </transition>
</template>

<script type="text/babel">
  const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  }

  export default {
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null,
        dangerouslyUseHTMLString: false,
        center: false
      }
    },

    computed: {
      iconWrapClass() {
        const classes = ['k-message__icon']
        if (this.type && !this.iconClass) {
          classes.push(`k-message__icon--${this.type}`)
        }
        return classes
      },

      typeClass() {
        return this.type && !this.iconClass
          ? `k-message__icon k-icon-${typeMap[this.type]}`
          : ''
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false
          this.$el.addEventListener('transitionend', this.destroyElement)
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement)
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      },

      close() {
        this.closed = true
        if (typeof this.onClose === 'function') {
          this.onClose(this)
        }
      },

      clearTimer() {
        clearTimeout(this.timer)
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close()
            }
          }, this.duration)
        }
      },
      keydown(e) {
        if (e.keyCode === 27) { // esc关闭消息
          if (!this.closed) {
            this.close()
          }
        }
      }
    },
    mounted() {
      this.startTimer()
      document.addEventListener('keydown', this.keydown)
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown)
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-message__closeBtn:focus,
.k-message__content:focus{
  outline-width: 0
}
.k-message {
    // border-radius: 4px;
    overflow: hidden
}

.k-message {
    min-width: 380px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: #ebeef5;
    position: fixed;
    left: 50%;
    // left:0;
    width: 100%;
    top: 0px;
    font-size: 16px;
    text-align: center;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background-color: #edf2fc;
    -webkit-transition: opacity .3s, -webkit-transform .4s;
    transition: opacity .3s, -webkit-transform .4s;
    transition: opacity .3s, transform .4s;
    transition: opacity .3s, transform .4s, -webkit-transform .4s;
    padding: 20px 15px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    justify-content: center;
}

.k-message.is-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center
}

.k-message.is-closable .k-message__content {
    padding-right: 16px
}

.k-message p {
    margin: 0
}

.k-message--info .k-message__content {
    color: #fff
}

.k-message--success {
    background-color: $mainColor;
    border-color:$mainColor;
}

.k-message--success .k-message__content {
    color: #fff;
}

.k-message--warning {
    background-color: #F5A623;
    border-color: #F5A623;
}

.k-message--warning .k-message__content {
    color: #fff;
}

.k-message--error {
    background-color: #ED5430;
    border-color: #ED5430
}

.k-message--error .k-message__content {
    color: #fff
}

.k-message__icon {
    margin-right: 10px
}

.k-message__content {
    padding: 0;
    font-size: 14px;
    line-height: 1
}

.k-message__closeBtn {
    position: absolute;
    top: 50%;
    right: 15px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    cursor: pointer;
    color: #c0c4cc;
    font-size: 16px
}

.k-message__closeBtn:hover {
    color: #909399
}

.k-message .k-icon-success {
    color: #fff;
}

.k-message .k-icon-error {
    color:  #fff;
}

.k-message .k-icon-info {
    color:  #fff;
}

.k-message .k-icon-warning {
    color:  #fff;
}

.k-message-fade-enter,
.k-message-fade-leave-active {
    opacity: 0;
    -webkit-transform: translate(-50%, -100%);
    transform: translate(-50%, -100%)
}
</style>


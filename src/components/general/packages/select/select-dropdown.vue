<template>
  <div
    class="nk-select-dropdown nk-popper"
    :class="[{ 'is-multiple': $parent.multiple }, popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script type="text/babel">
  import Popper from '../../src/utils/vue-popper'

  export default {
    name: 'nkSelectDropdown',

    componentName: 'nkSelectDropdown',

    mixins: [Popper],

    props: {
      // 默认是从popper的target底部放置popper
      placement: {
        default: 'bottom-start'
      },

      boundariesPadding: {
        default: 0
      },

      popperOptions: {
        default() {
          return {
            gpuAcceleration: false
          }
        }
      },

      visibleArrow: {
        default: true
      },

      appendToBody: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        minWidth: ''
      }
    },

    computed: {
      // 父元素自定义的popperClass
      popperClass() {
        return this.$parent.popperClass
      }
    },

    watch: {
      // 父元素的inputWidth, 用来决定popper的最小宽度
      '$parent.inputWidth'() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px'
      }
    },

    mounted() {
      // input组件为参考元素
      this.referenceElm = this.$parent.$refs.reference.$el
      // 相对于父元素的popper为当前组件
      this.$parent.popperElm = this.popperElm = this.$el
      // vue-popper, 订阅updatePopper，根据父元素的visible触发updatePopper
      this.$on('updatePopper', () => {
        if (this.$parent.visible) this.updatePopper()
      })
      this.$on('destroyPopper', this.destroyPopper)
    }
  }
</script>

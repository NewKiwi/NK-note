<template>
  <div
    class="k-select-dropdown k-popper k-popover"
    :class="[popperClass]"
    :style="{ minWidth: minWidth }">
    <slot></slot>
  </div>
</template>

<script>
  import Popper from '../../../src/utils/vue-popper'

  export default {
    name: 'KSelectDropdown',

    componentName: 'KSelectDropdown',

    mixins: [Popper],

    props: {
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
      popperClass() {
        return this.$parent.popperClass
      }
    },

    watch: {
      '$parent.inputWidth'() {
        this.minWidth = this.$parent.$el.getBoundingClientRect().width + 'px'
      }
    },

    mounted() {
      this.referenceElm = this.$parent.$refs.reference.$el
      this.$parent.popperElm = this.popperElm = this.$el
      this.$on('updatePopper', () => {
        if (this.$parent.visible) this.updatePopper()
      })
      this.$on('destroyPopper', this.destroyPopper)
    }
  }
</script>

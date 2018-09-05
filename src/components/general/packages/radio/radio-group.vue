<!-- // 没有作键盘事件的处理 -->
<template>
  <div
    class="nk-radio-group"
  >
    <slot></slot>
  </div>
</template>

<script>
  import Emitter from '@/components/general/src/utils/emitter'
  export default {
    name: 'NkRadioGroup',

    componentName: 'NkRadioGroup',

    inject: {
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {},
      size: String,
      disabled: Boolean,
      // fill和textColor为按钮形式radio时有效
      fill: String,
      textColor: String
    },

    mixins: [Emitter],

    computed: {
      _nkFormItemSize() {
        return (this.nkFormItem || {}).nkFormItemSize
      },
      radioGroupSize() {
        return this.size || this._nkFormItemSize || (this.$ELEMENT || {}).size
      }
    },

    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [this.value])
      }
    },

    created() {
      this.$on('handleChange', value => {
        this.$emit('change', value)
      })
    }
  }
</script>

<style lang='scss'>
.nk-radio-group {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-size: 0
}
</style>

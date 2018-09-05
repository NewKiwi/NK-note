<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>

<script>
  import Emitter from '@/components/general/src/utils/emitter'

  export default {
    name: 'NkCheckboxGroup',

    componentName: 'NkCheckboxGroup',

    mixins: [Emitter],

    inject: {
      nkFormItem: {
        default: ''
      }
    },

    props: {
      value: {},
      disabled: Boolean,
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String
    },

    computed: {
      _nkFormItemSize() {
        return (this.nkFormItem || {}).nkFormItemSize
      },
      checkboxGroupSize() {
        return this.size || this._nkFormItemSize || (this.$ELEMENT || {}).size
      }
    },

    watch: {
      value(value) {
        this.dispatch('NkFormItem', 'nk.form.change', [value])
      }
    }
  }
</script>

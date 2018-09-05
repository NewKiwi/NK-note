<template>
  <div
    class="k-radio-group"
  >
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from '../../../src/utils/mixins/emitter'
  export default {
    name: 'KRadioGroup',

    componentName: 'KRadioGroup',

    inject: {
      KFormItem: {
        default: ''
      }
    },

    mixins: [Emitter],

    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },

    created() {
      this.$on('handleChange', value => {
        this.$emit('change', value)
      })
    },
    watch: {
      value(value) {
        this.dispatch('KFormItem', 'KForm.change', [this.value])
      }
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-radio-button,
.k-radio-button__inner {
    display: inline-block;
    position: relative;
    outline: 0
}
.k-radio-group {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    font-size: 0
}
.k-radio-button__inner {
    line-height: 1;
    white-space: nowrap;
    background: #fff;
    border: 1px solid $mainBorder;
    font-weight: 500;
    border-left: 0;
    color: #e1e1e1;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    cursor: pointer;
    -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 0
}

.k-radio-button__inner.is-round {
    padding: 12px 20px
}

.k-radio-button__inner:hover {
    color: $mainColor;
}

.k-radio-button__inner [class*=k-icon-] {
    line-height: .9
}

.k-radio-button__inner [class*=k-icon-]+span {
    margin-left: 5px
}

.k-radio-button:first-child .k-radio-button__inner {
    // border-left: 1px solid #E1E1E1;
    -webkit-box-shadow: none!important;
    box-shadow: none!important
}

.k-radio-button__orig-radio {
    opacity: 0;
    outline: 0;
    position: absolute;
    z-index: -1
}

.k-radio-button__orig-radio:checked+.k-radio-button__inner {
    color: #fff;
    background-color: $mainColor;
    border-color: $mainColor;
    -webkit-box-shadow: -1px 0 0 0 $mainColor;
    box-shadow: -1px 0 0 0 $mainColor
}

.k-radio-button__orig-radio:disabled+.k-radio-button__inner {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #E1E1E1;
    -webkit-box-shadow: none;
    box-shadow: none
}

.k-radio-button__orig-radio:disabled:checked+.k-radio-button__inner {
    background-color: #f2f6fc
}

.k-radio-button:focus:not(.is-focus):not(:active) {
    -webkit-box-shadow: 0 0 2px 2px $mainColor;
    box-shadow: 0 0 2px 2px $mainColor
}
</style>

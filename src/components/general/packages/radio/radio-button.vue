<template>
  <label
    class="nk-radio-button"
    :class="[
      size ? 'nk-radio-button--' + size : '',
      { 'is-active': value === label },
      { 'is-disabled': isDisabled },
      { 'is-focus': focus }
    ]"
    @keydown.space.stop.prevent="value = label"
  >
    <input
      class="nk-radio-button__orig-radio"
      :value="label"
      type="radio"
      v-model="value"
      :name="name"
      @change="handleChange"
      :disabled="isDisabled"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span class="nk-radio-button__inner" :style="value === label ? activeStyle : null">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '@/components/general/src/utils/emitter'

  export default {
    name: 'NkRadioButton',

    mixins: [Emitter],

    inject: {
      nkForm: {
        default: ''
      },
      nkFormItem: {
        default: ''
      }
    },

    props: {
      label: {},
      disabled: Boolean,
      name: String
    },
    data() {
      return {
        focus: false
      }
    },
    // radio按钮不提供单独使用
    computed: {
      value: {
        get() {
          return this._radioGroup.value
        },
        set(value) {
          this._radioGroup.$emit('input', value)
        }
      },
      _radioGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'NkRadioGroup') {
            parent = parent.$parent
          } else {
            return parent
          }
        }
        return false
      },
      activeStyle() {
        return {
          backgroundColor: this._radioGroup.fill || '',
          borderColor: this._radioGroup.fill || '',
          boxShadow: this._radioGroup.fill ? `-1px 0 0 0 ${this._radioGroup.fill}` : '',
          color: this._radioGroup.textColor || ''
        }
      },
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize
      },
      size() {
        return this._radioGroup.radioGroupSize || this._elFormItemSize || (this.$ELEMENT || {}).size
      },
      isDisabled() {
        return this.disabled || this._radioGroup.disabled || (this.elForm || {}).disabled
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.dispatch('ElRadioGroup', 'handleChange', this.value)
        })
      }
    }
  }
</script>

<style lang="scss">
  @charset "UTF-8";
.nk-radio-button,
.nk-radio-button__inner {
    display: inline-block;
    position: relative;
    outline: 0
}

.nk-radio-button__inner {
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
    background: #fff;
    border: 1px solid #dcdfe6;
    font-weight: 500;
    border-left: 0;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    cursor: pointer;
    -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 0
}

.nk-radio-button__inner.is-round {
    padding: 12px 20px
}

.nk-radio-button__inner:hover {
    color: #409EFF
}

.nk-radio-button__inner [class*=nk-icon-] {
    line-height: .9
}

.nk-radio-button__inner [class*=nk-icon-]+span {
    margin-left: 5px
}

.nk-radio-button:first-child .nk-radio-button__inner {
    border-left: 1px solid #dcdfe6;
    border-radius: 4px 0 0 4px;
    -webkit-box-shadow: none!important;
    box-shadow: none!important
}

.nk-radio-button__orig-radio {
    opacity: 0;
    outline: 0;
    position: absolute;
    z-index: -1
}

.nk-radio-button__orig-radio:checked+.nk-radio-button__inner {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    -webkit-box-shadow: -1px 0 0 0 #409EFF;
    box-shadow: -1px 0 0 0 #409EFF
}

.nk-radio-button__orig-radio:disabled+.nk-radio-button__inner {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
    -webkit-box-shadow: none;
    box-shadow: none
}

.nk-radio-button__orig-radio:disabled:checked+.nk-radio-button__inner {
    background-color: #f2f6fc
}

.nk-radio-button:last-child .nk-radio-button__inner {
    border-radius: 0 4px 4px 0
}

.nk-radio-button:first-child:last-child .nk-radio-button__inner {
    border-radius: 4px
}

.nk-radio-button--medium .nk-radio-button__inner {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 0
}

.nk-radio-button--medium .nk-radio-button__inner.is-round {
    padding: 10px 20px
}

.nk-radio-button--small .nk-radio-button__inner {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 0
}

.nk-radio-button--small .nk-radio-button__inner.is-round {
    padding: 9px 15px
}

.nk-radio-button--mini .nk-radio-button__inner {
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 0
}

.nk-radio-button--mini .nk-radio-button__inner.is-round {
    padding: 7px 15px
}

.nk-radio-button:focus:not(.is-focus):not(:active) {
    -webkit-box-shadow: 0 0 2px 2px #409EFF;
    box-shadow: 0 0 2px 2px #409EFF
}
</style>

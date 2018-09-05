<template>
  <div :class="[
    type === 'textarea' ? 'k-textarea' : 'k-input',
    {
      'is-disabled': inputDisabled,
      'k-input--prefix': $slots.prefix || prefixIcon,
      'k-input--suffix': $slots.suffix || suffixIcon
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <input
        v-if="type !== 'textarea'"
        class="k-input__inner"
        v-bind="$attrs"
        :type="type"
        :size="size"
        :disabled="inputDisabled"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
      <!-- 前置内容 -->
      <span class="k-input__prefix" v-if="$slots.prefix || prefixIcon" :style="prefixOffset">
        <slot name="prefix"></slot>
        <i class="k-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="k-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear"
        :style="suffixOffset">
        <span class="k-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="k-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-else
            class="k-input__icon k-icon-circle-close k-input__clear"
            @click="clear"
          ></i>
        </span>
      </span>
      <span v-if='$slots.append' class="k-input__append" @click="focus">
        <slot name='append'></slot>
      </span>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="k-textarea__inner"
      :value="currentValue"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
    </textarea>
  </div>
</template>
<script>
  import emitter from '../../../src/utils/mixins/emitter'
  import calcTextareaHeight from './calcTextareaHeight'
  import merge from '../../../src/utils/merge'

  export default {
    name: 'KInput',

    componentName: 'KInput',

    mixins: [emitter],

    inheritAttrs: false,

    inject: {
      KForm: {
        default: ''
      },
      KFormItem: {
        default: ''
      }
    },

    data() {
      return {
        currentValue: this.value === undefined || this.value === null
          ? ''
          : this.value,
        textareaCalcStyle: {},
        prefixOffset: null,
        suffixOffset: null,
        hovering: false,
        focused: false
      }
    },

    props: {
      value: [String, Number],
      size: String,
      resize: String,
      form: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      validateEvent: {
        type: Boolean,
        default: true
      },
      suffixIcon: String,
      prefixIcon: String,
      label: String,
      clearable: {
        type: Boolean,
        default: false
      },
      tabindex: String
    },

    computed: {
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize })
      },
      inputDisabled() {
        return this.disabled || (this.KForm || {}).disabled
      },
      showClear() {
        return this.clearable && !this.disabled && this.currentValue !== '' && (this.focused || this.hovering)
      }
    },

    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val)
      }
    },

    methods: {
      focus() {
        (this.$refs.input || this.$refs.textarea).focus()
      },
      blur() {
        (this.$refs.input || this.$refs.textarea).blur()
      },
      handleBlur(event) {
        this.focused = false
        this.$emit('blur', event)
        if (this.validateEvent) {
          this.dispatch('KFormItem', 'KForm.blur', [this.currentValue])
        }
        if (this.$parent && this.$parent.$options.componentName === 'inputLine') {
          this.$parent.$emit('hide-line')
        }
        // if (this.$parent && this.$parent.$options.componentName === 'inputBox') {
        //   this.$parent.$emit('hide-box')
        // }
        this.dispatch('inputBox', 'hide-box')
      },
      select() {
        (this.$refs.input || this.$refs.textarea).select()
      },
      resizeTextarea() {
        if (this.$isServer) return
        const { autosize, type } = this
        if (type !== 'textarea') return
        if (!autosize) {
          this.textareaCalcStyle = {
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          }
          return
        }
        const minRows = autosize.minRows
        const maxRows = autosize.maxRows

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
      },
      handleFocus(event) {
        this.focused = true
        this.$emit('focus', event)
        if (this.$parent && this.$parent.$options.componentName === 'inputLine') {
          this.$parent.$emit('show-line')
        }
      //  if (this.$parent && this.$parent.$options.componentName === 'inputBox') {
      //     this.$parent.$emit('show-box')
      //   }
        this.dispatch('inputBox', 'show-box')
      },
      handleInput(event) {
        const value = event.target.value
        this.$emit('input', value)
        this.setCurrentValue(value)
      },
      handleChange(event) {
        this.$emit('change', event.target.value)
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return
        this.$nextTick(_ => {
          this.resizeTextarea()
        })
        this.currentValue = value
        if (this.validateEvent) {
          this.dispatch('KFormItem', 'KForm.change', [value])
        }
      },
      clear() {
        this.$emit('input', '')
        this.$emit('change', '')
        this.$emit('clear')
        this.setCurrentValue('')
        this.focus()
      }
    },

    created() {
      this.$on('inputSelect', this.select)
    },

    mounted() {
      this.resizeTextarea()
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-textarea {
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px
}

.k-textarea__inner {
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: $mainText;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1)
}

.k-textarea__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.k-textarea__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.k-textarea__inner::placeholder {
    color: #c0c4cc
}

.k-textarea__inner:hover {
    border-color: #c0c4cc
}

.k-textarea__inner:focus {
    outline: 0;
    border-color: $mainColor;
}

.k-textarea.is-disabled .k-textarea__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed
}

.k-textarea.is-disabled .k-textarea__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.k-textarea.is-disabled .k-textarea__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.k-textarea.is-disabled .k-textarea__inner::placeholder {
    color: #c0c4cc
}
.k-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%
}

.k-input::-webkit-scrollbar {
    z-index: 11;
    width: 6px
}

.k-input::-webkit-scrollbar:horizontal {
    height: 6px
}

.k-input::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc
}

.k-input::-webkit-scrollbar-corner {
    background: #fff
}

.k-input::-webkit-scrollbar-track {
    background: #fff
}

.k-input::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px
}

.k-input .k-input__clear {
    color: #c0c4cc;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    -webkit-transition: color .2s cubic-bezier(.645, .045, .355, 1);
    transition: color .2s cubic-bezier(.645, .045, .355, 1)
}

.k-input .k-input__clear:hover {
    color: #909399
}

.k-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    // border-radius: 4px;
    border: $mainBorder;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: $mainText;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%
}

.k-input__prefix,
.k-input__suffix {
    position: absolute;
    top: 0;
    -webkit-transition: all .3s;
    transition: all .3s;
    height: 100%;
    color: $placeholderText;
    text-align: center
}

.k-input__inner::-webkit-input-placeholder {
    color: $placeholderText
}

.k-input__inner:-ms-input-placeholder {
    color: $placeholderText
}

.k-input__inner::placeholder {
    color: $placeholderText
}

.k-input__inner:hover {
    border-color: $placeholderText
}

.k-input.is-active .k-input__inner,
.k-input__inner:focus {
    border-color: $mainColor;
    outline: 0
}

.k-input__suffix {
    right: 5px;
    transition: all .3s
}

.k-input__suffix-inner {
    pointer-events: all
}

.k-input__prefix {
    left: 5px;
    transition: all .3s
}

.k-input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
    line-height: 40px
}

.k-input__icon:after {
    content: '';
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle
}

.k-input.is-disabled .k-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed
}

.k-input.is-disabled .k-input__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.k-input.is-disabled .k-input__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.k-input.is-disabled .k-input__inner::placeholder {
    color: #c0c4cc
}

.k-input.is-disabled .k-input__icon {
    cursor: not-allowed
}

.k-input--suffix .k-input__inner {
    padding-right: 30px
}

.k-input--prefix .k-input__inner {
    padding-left: 30px
}

.k-input__inner::-ms-clear {
    display: none;
    width: 0;
    height: 0
}
</style>

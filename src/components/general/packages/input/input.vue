<template>
  <!--
  inputSize: computed,根据form-item和input的size计算, this.$ELEMENT?
  inputDisable: computed, 根据input的disabled和form的disabled计算
  hovering: 控制鼠标悬浮时清空按钮的出现
  -->
  <div :class="[
    type === 'textarea' ? 'nk-textarea' : 'nk-input',
    inputSize ? 'nk-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'nk-input-group': $slots.prepend || $slots.append,
      'nk-input-group--append': $slots.append,
      'nk-input-group--prepend': $slots.prepend,
      'nk-input--prefix': $slots.prefix || prefixIcon,
      'nk-input--suffix': $slots.suffix || suffixIcon
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <template v-if="type !== textarea">
      <div class="nk-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="nk-input__inner"
        v-bind="$attrs"
        :type="type"
        :disabled="inputDisabled"
        :autocomplete="autoComplete"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
      <!-- 该组件不做IME的处理 -->
<!--    @compositionstart="handleComposition"
        @compositionupdate="handleComposition"
        @compositionend="handleComposition" -->
      <span class="nk-input__prefix" v-if="$slots.prefix || prefixIcon" :style="prefixOffset">
        <slot name="prefix"></slot>
        <i class="nk-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <span
        class="nk-input__suffix"
        v-if="$slots.suffix || suffixIcon || showClear || validateState && needStatusIcon"
        :style="suffixOffset">
        <span class="nk-input__suffix-inner">
          <template v-if="!showClear">
            <slot name="suffix"></slot>
            <i class="nk-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-else
            class="nk-input__icon nk-icon-circle-close nk-input__clear"
            @click="clear"
          ></i>
        </span>
        <i class="nk-input__icon"
          v-if="validateState"
          :class="['nk-input__validateIcon', validateIcon]">
        </i>
      </span>
      <div class="nk-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
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
    <!-- 该组件不做IME的处理 -->
<!--  @compositionstart="handleComposition"
      @compositionupdate="handleComposition"
      @compositionend="handleComposition" -->
    </textarea>
  </div>
</template>

<script>
  import emitter from '@/components/general/src/utils/emitter'
  import merge from '@/components/general/src/utils/merge'
  // 计算textarea的高度,这个高度不是内容的高度,而是元素的高度,目的是让textarea可以根据输入内容进行高度的调整
  import calcTextareaHeight from './calcTextareaHeight'
  // 版本功能迁移提示
  // import Migrating from 'element-ui/src/mixins/migrating';
  // 判断是否朝鲜语？
  // import { isKorean } from 'element-ui/src/utils/shared';
  export default {
    name: 'NkInput',

    componentName: 'NkInput',

    mixins: [emitter],

    inheritAttrs: false,

    // input组件用在表单时使用
    inject: {
      nkForm: {
        default: ''
      },

      nkFormItem: {
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
        // 控制清除图标
        hovering: false,
        focused: false
      }
    },

    props: {
      value: [String, Number],
      size: String,
      // 能否被用户缩放,css控制原生的缩放效果
      resize: String,
      // 所属表单
      form: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      // 自动调整高度，textarea
      autoSize: {
        type: [Boolean, Object],
        default: false
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      suffixIcon: String,
      prefixIcon: String,
      label: String,
      clearable: {
        type: Boolean,
        default: false
      },
      tabindex: String,
      // 表单组件验证事件
      validateEvent: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      // 这部分计算选项的属性是用于表单的
      _elFormItemSize() {
        return (this.nkFormItem || {}).nkFormItemSize
      },
      validateState() {
        return this.nkFormItem ? this.nkFormItem.validateState : ''
      },
      needStatusIcon() {
        return this.nkForm ? this.nkForm.statusIcon : false
      },
      validateIcon() {
        return {
          validating: 'nk-icon-loading',
          success: 'nk-icon-circle-check',
          error: 'nk-icon-circle-close'
        }[this.validateState]
      },
      // 这部分计算选项的属性是用于非表单的
      textareaStyle() {
        return merge({}, this.textareaCalcStyle, { resize: this.resize })
      },
      // this.$ELEMENT || {} 避免报错，即提供初始值
      inputSize() {
        return this.size || this._nkFormItemSize || (this.$ELEMENT || {}).size
      },
      inputDisabled() {
        return this.disabled || (this.nkForm || {}).disabled
      },
      isGroup() {
        return this.$slots.prepend || this.$slots.append
      },
      showClear() {
        return this.clearable && !this.disabled && this.currentValue !== '' && (this.focused || this.hovering)
      }
    },

    watch: {
      value(val, oldValue) {
        this.setCurrentValue(val)
      }
    },

    methods: {
      // input Methods
      focus() {
        (this.$refs.input || this.$refs.textarea).focus()
      },
      blur() {
        (this.$refs.input || this.$refs.textarea).blur()
      },
      select() {
        (this.$refs.input || this.$refs.textarea).select()
      },
      // input event
      handleBlur(event) {
        this.focused = false
        this.$emit('blur', event)
        if (this.validateEvent) {
          this.dispatch('NkFormItem', 'nk.form.blur', [this.currentValue])
        }
      },
      handleFocus(event) {
        this.focused = true
        this.$emit('focus', event)
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
        // 保证resizeTextarea计算高度的准确性 https://cn.vuejs.org/v2/api/#Vue-nextTick
        this.$nextTick(_ => {
          this.resizeTextarea()
        })
        this.currentValue = value
        if (this.validateEvent) {
          this.dispatch('NkFormItem', 'nk.form.change', [value])
        }
      },
      clear() {
        this.$emit('input', '')
        this.$emit('change', '')
        this.$emit('clear')
        this.setCurrentValue('')
        this.focus()
      },
      resizeTextarea() {
        if (this.$isServer) return
        const { autosize, type } = this
        if (type !== 'textarea') return
        if (!autosize) {
          this.textareaCalcStyle = {
            // calcTextareaHeight()带有默认一行的参数
            minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
          }
          return
        }
        const minRows = autosize.minRows
        const maxRows = autosize.maxRows

        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows)
      },
      // 存在前置或后置元素时，前置或后置内容进行偏移
      // 因为前置或后置内容是相对于input组件根元素进行定位的，当出现前置或后置元素，不进行偏移，前置元素会和前置内容重叠，后置元素会和后置内容重叠
      calcIconOffset(place) {
        const pendantMap = {
          'suf': 'append',
          'pre': 'prepend'
        }

        const pendant = pendantMap[place]

        if (this.$slots[pendant]) {
          return { transform: `translateX(${place === 'suf' ? '-' : ''}${this.$el.querySelector(`.nk-input-group__${pendant}`).offsetWidth}px)` }
        }
      }
    },

    created() {
      this.$on('inputSelect', this.select)
    },

    mounted() {
      this.resizeTextarea()
      if (this.isGroup) {
        this.prefixOffset = this.calcIconOffset('pre')
        this.suffixOffset = this.calcIconOffset('suf')
      }
    }
  }
</script>

<style lang='scss'>
.nk-textarea {
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px
}

.nk-textarea__inner {
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1)
}

.nk-textarea__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.nk-textarea__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.nk-textarea__inner::placeholder {
    color: #c0c4cc
}

.nk-textarea__inner:hover {
    border-color: #c0c4cc
}

.nk-textarea__inner:focus {
    outline: 0;
    border-color: #409EFF
}

.nk-textarea.is-disabled .nk-textarea__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed
}

.nk-textarea.is-disabled .nk-textarea__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.nk-textarea.is-disabled .nk-textarea__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.nk-textarea.is-disabled .nk-textarea__inner::placeholder {
    color: #c0c4cc
}

.nk-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%
}

.nk-input::-webkit-scrollbar {
    z-index: 11;
    width: 6px
}

.nk-input::-webkit-scrollbar:horizontal {
    height: 6px
}

.nk-input::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc
}

.nk-input::-webkit-scrollbar-corner {
    background: #fff
}

.nk-input::-webkit-scrollbar-track {
    background: #fff
}

.nk-input::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px
}

.nk-input .nk-input__clear {
    color: #c0c4cc;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    -webkit-transition: color .2s cubic-bezier(.645, .045, .355, 1);
    transition: color .2s cubic-bezier(.645, .045, .355, 1)
}

.nk-input .nk-input__clear:hover {
    color: #909399
}

.nk-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
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

.nk-input__prefix,
.nk-input__suffix {
    position: absolute;
    top: 0;
    -webkit-transition: all .3s;
    text-align: center;
    height: 100%;
    color: #c0c4cc
}

.nk-input__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.nk-input__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.nk-input__inner::placeholder {
    color: #c0c4cc
}

.nk-input__inner:hover {
    border-color: #c0c4cc
}

.nk-input.is-active .nk-input__inner,
.nk-input__inner:focus {
    border-color: #409EFF;
    outline: 0
}

.nk-input__suffix {
    right: 5px;
    transition: all .3s;
    pointer-events: none
}

.nk-input__suffix-inner {
    pointer-events: all
}

.nk-input__prefix {
    left: 5px;
    transition: all .3s
}

.nk-input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
    line-height: 40px
}

.nk-input__icon:after {
    content: '';
    height: 100%;
    width: 0;
    display: inline-block;
    vertical-align: middle
}

.nk-input__validateIcon {
    pointer-events: none
}

.nk-input.is-disabled .nk-input__inner {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed
}

.nk-input.is-disabled .nk-input__inner::-webkit-input-placeholder {
    color: #c0c4cc
}

.nk-input.is-disabled .nk-input__inner:-ms-input-placeholder {
    color: #c0c4cc
}

.nk-input.is-disabled .nk-input__inner::placeholder {
    color: #c0c4cc
}

.nk-input.is-disabled .nk-input__icon {
    cursor: not-allowed
}

.nk-input--suffix .nk-input__inner {
    padding-right: 30px
}

.nk-input--prefix .nk-input__inner {
    padding-left: 30px
}

.nk-input--medium {
    font-size: 14px
}

.nk-input--medium .nk-input__inner {
    height: 36px;
    line-height: 36px
}

.nk-input--medium .nk-input__icon {
    line-height: 36px
}

.nk-input--small {
    font-size: 13px
}

.nk-input--small .nk-input__inner {
    height: 32px;
    line-height: 32px
}

.nk-input--small .nk-input__icon {
    line-height: 32px
}

.nk-input--mini {
    font-size: 12px
}

.nk-input--mini .nk-input__inner {
    height: 28px;
    line-height: 28px
}

.nk-input--mini .nk-input__icon {
    line-height: 28px
}

.nk-input-group {
    line-height: normal;
    display: inline-table;
    width: 100%;
    border-collapse: separate
}

.nk-input-group>.nk-input__inner {
    vertical-align: middle;
    display: table-cell
}

.nk-input-group__append,
.nk-input-group__prepend {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap
}

.nk-input-group--prepend .nk-input__inner,
.nk-input-group__append {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0
}

.nk-input-group--append .nk-input__inner,
.nk-input-group__prepend {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0
}

.nk-input-group__append:focus,
.nk-input-group__prepend:focus {
    outline: 0
}

.nk-input-group__append .nk-button,
.nk-input-group__append .nk-select,
.nk-input-group__prepend .nk-button,
.nk-input-group__prepend .nk-select {
    display: inline-block;
    margin: -10px -20px
}

.nk-input-group__append button.nk-button,
.nk-input-group__append div.nk-select .nk-input__inner,
.nk-input-group__append div.nk-select:hover .nk-input__inner,
.nk-input-group__prepend button.nk-button,
.nk-input-group__prepend div.nk-select .nk-input__inner,
.nk-input-group__prepend div.nk-select:hover .nk-input__inner {
    border-color: transparent;
    background-color: transparent;
    color: inherit;
    border-top: 0;
    border-bottom: 0
}

.nk-input-group__append .nk-button,
.nk-input-group__append .nk-input,
.nk-input-group__prepend .nk-button,
.nk-input-group__prepend .nk-input {
    font-size: inherit
}

.nk-input-group__prepend {
    border-right: 0
}

.nk-input-group__append {
    border-left: 0
}

.nk-input-group--append .nk-select .nk-input.is-focus .nk-input__inner,
.nk-input-group--prepend .nk-select .nk-input.is-focus .nk-input__inner {
    border-color: transparent
}

.nk-input__inner::-ms-clear {
    display: none;
    width: 0;
    height: 0
}
</style>

<template>
  <label
    class="nk-checkbox"
    :class="[
      border && checkboxSize ? 'nk-checkbox--' + checkboxSize : '',
      { 'is-disabled': isDisabled },
      { 'is-bordered': border },
      { 'is-checked': isChecked }
    ]"
    :id="id"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
  >
    <span class="nk-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      aria-checked="mixed"
    >
      <span class="nk-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="nk-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <input
        v-else
        class="nk-checkbox__original"
        type="checkbox"
        aria-hidden="true"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="nk-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>

<script>
  import Emitter from '@/components/general/src/utils/emitter'

  export default {
    name: 'NkCheckbox',

    componentName: 'NkCheckbox',

    mixins: [Emitter],

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
        selfModel: false,
        focus: false,
        // 限制勾选数量,是否$emit('input')
        isLimitExceeded: false
      }
    },

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      border: Boolean,
      size: String,
      // 单独的checkbox作为全选控制
      indeterminate: Boolean,
      id: String, /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */
      controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系 */

    },

    computed: {
      model: {
        get() {
          // 处理组和单个checkbox时绑定的值，单个checkbox时绑定的值如果是undefined,返回false(model的set会变化selfModel的值，这是处理单个使用时，可以用true和false的情况)
          return this.isGroup
            ? this.store : this.value !== undefined
              ? this.value : this.selfModel
        },

        set(val) {
          if (this.isGroup) {
            this.isLimitExceeded = false
            // 判断勾选数量是否少于min
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true))

            // 判断勾选数量是否大于于max
            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true))

            this.isLimitExceeded === false &&
            this.dispatch('NkCheckboxGroup', 'input', [val])
          } else {
            this.$emit('input', val)
            this.selfModel = val
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel
        }
      },

      isGroup() {
        let parent = this.$parent

        while (parent) {
          if (parent.$options.componentName !== 'NkCheckboxGroup') {
            parent = parent.$parent
          } else {
            this._checkboxGroup = parent
            return true
          }
        }
        return false
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value
      },

      isDisabled() {
        return this.isGroup
          ? this._checkboxGroup.disabled || this.disabled || (this.nkForm || {}).disabled
          : this.disabled || (this.nkForm || {}).disabled
      },

      _nkFormItemSize() {
        return (this.nkFormItem || {}).nkFormItemSize
      },

      checkboxSize() {
        const temCheckboxSize = this.size || this._nkFormItemSize || (this.$ELEMENT || {}).size
        return this.isGroup
          ? this._checkboxGroup.checkboxGroupSize || temCheckboxSize
          : temCheckboxSize
      }
    },

    methods: {
      // 初始化当checked为真时，就触发赋值操作
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label)
        } else {
          this.model = this.trueLabel || true
        }
      },

      handleChange(ev) {
        if (this.isLimitExceeded) return
        let value
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel
        }
        // checkbox事件
        this.$emit('change', value, ev)
        // checkbox-group事件
        this.$nextTick(() => {
          if (this.isGroup) {
            this.dispatch('ElCheckboxGroup', 'change', [this._checkboxGroup.value])
          }
        })
      }
    },

    created() {
      this.checked && this.addToStore()
    },
    mounted() { // 为indeterminate元素 添加aria-controls 属性
      if (this.indeterminate) {
        this.$el.setAttribute('aria-controls', this.controls)
      }
    }
  }
</script>

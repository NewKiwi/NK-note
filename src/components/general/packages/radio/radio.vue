<template>
   <!-- @keydown.space.stop.prevent="model = label"按下空格键相当于选中单选框，并阻止事件传播和浏览器默认行为-->
   <!-- border为真时radioSize才生效 -->
  <label
    class="nk-radio"
    :class="[
      border && radioSize ? 'nk-radio--' + radioSize : '',
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-bordered': border },
      { 'is-checked': model === label }
    ]"
    @keydown.space.stop.prevent="model = label"
  >
    <span class="nk-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="nk-radio__inner"></span>
      <input
        class="nk-radio__original"
        :value="label"
        type="radio"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
      >
    </span>
    <span class="nk-radio__label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>

<script>
  import Emitter from '@/components/general/src/utils/emitter'
  export default {
    name: 'NkRadio',

    componentName: 'NkRadio',

    inject: {
      nkForm: {
        default: ''
      },
      nkFormItem: {
        default: ''
      }
    },

    mixins: [Emitter],
    data() {
      return {
        focus: false
      }
    },

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },

    computed: {
      isGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'NkRadioGroup') {
            parent = parent.$parent
          } else {
            this._radioGroup = parent
            return true
          }
        }
        return false
      },

      model: {
        get() {
          return this._radioGroup ? this._radioGroup.value : this.value
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('NkRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      },

      _nkFormItemSize() {
        return (this.nkFormItem || {}).nkFormItemSize
      },

      radioSize() {
        const temRadioSize = this.size || this._nkFormItemSize || (this.$ELEMENT || {}).size
        return this.isGroup
          ? this._radioGroup.radioGroupSize || temRadioSize
          : temRadioSize
      },

      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.nkForm || {}).disabled
          : this.disabled || (this.nkForm || {}).disabled
      }
    },

    methods: {
      handleChange() {
        // 保证抛出正确的值
        this.$nextTick(() => {
          this.$emit('change', this.model)
          this.isGroup && this.dispatch('ElRadioGroup', 'handleChange', this.model)
        })
      }
    }
  }
</script>

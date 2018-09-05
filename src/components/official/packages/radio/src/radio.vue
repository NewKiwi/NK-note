<template>
  <label
    class="k-radio"
    :class="[
      { 'is-disabled': isDisabled },
      { 'is-focus': focus },
      { 'is-checked': model === label }
    ]"
    @keydown.space.stop.prevent="model = label"
  >
    <span class="k-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="k-radio__inner"></span>
      <input
        class="k-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
      >
    </span>
    <span class="k-radio__label">
      <slot></slot>
    </span>
  </label>
</template>
<script>
  import Emitter from '../../../src/utils/mixins/emitter'

  export default {
    name: 'KRadio',

    mixins: [Emitter],

    inject: {
      KForm: {
        default: ''
      },

      KFormItem: {
        default: ''
      }
    },

    componentName: 'KRadio',

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      name: String,
      border: Boolean,
      size: String
    },

    data() {
      return {
        focus: false
      }
    },
    computed: {
      isGroup() {
        let parent = this.$parent
        while (parent) {
          if (parent.$options.componentName !== 'KRadioGroup') {
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
          return this.isGroup ? this._radioGroup.value : this.value
        },
        set(val) {
          if (this.isGroup) {
            this.dispatch('KRadioGroup', 'input', [val])
          } else {
            this.$emit('input', val)
          }
        }
      },
      isDisabled() {
        return this.isGroup
          ? this._radioGroup.disabled || this.disabled || (this.KForm || {}).disabled
          : this.disabled || (this.KForm || {}).disabled
      },
      tabIndex() {
        return !this.isDisabled ? (this.isGroup ? (this.model === this.label ? 0 : -1) : 0) : -1
      }
    },

    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model)
          this.isGroup && this.dispatch('KRadioGroup', 'handleChange', this.model)
        })
      }
    }
  }
</script>

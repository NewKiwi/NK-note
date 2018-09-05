<template>
<div class="k-form-item" :class="{
  'is-error': validateState === 'error',
  'is-validating': validateState === 'validating',
  'is-success': validateState === 'success',
  'is-required': isRequired || required
}">
  <label :for="labelFor" class="k-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
    <slot name="label">{{label}}</slot>
  </label>
  <div class="k-form-item__content" v-bind:style="contentStyle">
    <slot></slot>
    <transition name="k-zoom-in-top">
      <div
        v-if="validateState === 'error' && showMessage && KForm.showMessage"
        class="k-form-item__error">
        {{validateMessage}}
      </div>
    </transition>
  </div>
</div>
</template>

<script>
import AsyncValidator from 'async-validator'
import emitter from '../../../src/utils/mixins/emitter'
import objectAssign from '../../../src/utils/merge'
import { noop, getPropByPath } from '../../../src/utils/util'
export default {
  name: 'KFormItem',

  componentName: 'KFormItem',

  mixins: [emitter],

  provide() {
    return {
      KFormItem: this
    }
  },

  inject: ['KForm'],

  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    for: String,
    showMessage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    }
  },
  watch: {
    error: {
      immediate: true,
      handler(value) {
        this.validateMessage = value
        this.validateState = value ? 'error' : ''
      }
    },
    validateStatus(value) {
      this.validateState = value
    }
  },
  computed: {
    labelFor() {
      return this.for || this.prop
    },
    labelStyle() {
      const ret = {}
      if (this.KForm.labelPosition === 'top') return ret
      const labelWidth = this.labelWidth || this.KForm.labelWidth
      if (labelWidth) {
        ret.width = labelWidth
      }
      return ret
    },
    contentStyle() {
      const ret = {}
      const label = this.label
      if (this.KForm.labelPosition === 'top') return ret
      if (!label && !this.labelWidth) return ret
      const labelWidth = this.labelWidth || this.KForm.labelWidth
      if (labelWidth) {
        ret.marginLeft = labelWidth
      }
      return ret
    },
    // cache已经废弃了，这样写有什么影响？
    fieldValue: {
      cache: false,
      get() {
        const model = this.KForm.model
        if (!model || !this.prop) { return false }

        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }
        return getPropByPath(model, path, true).v
      }
    },
    isRequired() {
      const rules = this.getRules()
      let isRequired = false

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }
      return isRequired
    }
  },
  methods: {
    validate(trigger, callback = noop) {
      this.validateDisabled = false
      const rules = this.getFilteredRule(trigger)
      if ((!rules || rules.length === 0) && this.required === undefined) {
        callback()
        return true
      }

      this.validateState = 'validating'

      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger
        })
      }
      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {}

      model[this.prop] = this.fieldValue

      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback(this.validateMessage, invalidFields, this.validateState)
        this.KForm && this.KForm.$emit('validate', this.prop, !errors)
      })
    },
    getRules() {
      // 将KForm和KFormItem的rules结合
      let formRules = this.KForm.rules
      const selfRules = this.rules
      const requiredRule = this.required !== undefined ? { required: !!this.required } : []

      const prop = getPropByPath(formRules, this.prop || '')
      formRules = formRules ? (prop.o[this.prop || ''] || prop.v) : []

      return [].concat(selfRules || formRules || []).concat(requiredRule)
    },
    getFilteredRule(trigger) {
      const rules = this.getRules()

      return rules.filter(rule => {
        if (!rule.trigger || trigger === '') return true
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      }).map(rule => objectAssign({}, rule))
    },
    onFieldBlur() {
      this.validate('blur')
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return false
      }

      this.validate('change')
    },
    clearValidate() {
      this.validateState = ''
      this.validateMessage = ''
      this.validateDisabled = false
    },
    resetField() {
      this.validateState = ''
      this.validateMessage = ''

      const model = this.KForm.model
      const value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      const prop = getPropByPath(model, path, true)

      this.validateDisabled = true
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        prop.o[prop.k] = this.initialValue
      }
    }
  },
  mounted() {
    if (this.prop) {
      this.dispatch('KForm', 'KForm.addField', [this])
      // 初始化model对象, 深复制
      let initialValue = this.fieldValue
      if (Array.isArray(initialValue)) {
        initialValue = [].concat(initialValue)
      }
      Object.defineProperty(this, 'initialValue', {
        value: initialValue
      })

      const rules = this.getRules()

      if (rules.length || this.required !== undefined) {
        this.$on('KForm.blur', this.onFieldBlur)
        this.$on('KForm.change', this.onFieldChange)
      }
    }
  },
  beforeDestroy() {
    this.dispatch('KForm', 'KForm.removeField', [this])
  }
}
</script>

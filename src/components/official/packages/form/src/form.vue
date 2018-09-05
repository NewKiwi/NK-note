<template>
  <form
    class="k-form"
    :class="[labelPosition ? `k-form__label--${labelPosition}` : '']">
    <slot></slot>
  </form>
</template>

<script>
import objectAssign from '../../../src/utils/merge'
export default {
  name: 'KForm',

  componentName: 'KForm',

  provide() {
    return {
      'KForm': this
    }
  },
  data() {
    return {
      fields: []
    }
  },
  props: {
    model: Object,
    rules: Object,
    labelPosition: String,
    labelWidht: String,
    disabled: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 重置表单的每一个字段
    resetFields() {
      if (!this.model) {
        console.warn('model is required!')
        return false
      }
      this.fields.forEach(field => {
        field.resetField()
      })
    },
    validate(callback) {
      if (!this.model) {
        console.warn('model is required!')
        return false
      }

      let promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          callback = function(valid) {
            valid ? resolve(valid) : reject(valid)
          }
        })
      }

      let valid = true
      let count = 0
      if (this.fields.length === 0 && callback) {
        callback(true)
      }
      let invalidFields = {}
      this.fields.forEach(field => {
        field.validate('', (message, field) => {
          // 其中一个校验失败则返回false
          if (message) {
            valid = false
          }
          // field为回调函数返回的校验失败的字段
          invalidFields = objectAssign({}, invalidFields, field)
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid, invalidFields)
          }
        })
      })

      if (promise) {
        return promise
      }
    },
    validateField(prop, cb) {
      const field = this.fields.filter(field => field.prop === prop)[0]
      if (!field) { throw new Error('must call validateField with valid prop string!') }

      field.validate('', cb)
    }
  },
  created() {
    this.$on('KForm.addField', field => {
      this.fields.push(field)
    })
    this.$on('KForm.removeField', field => {
      this.fields.splice(this.fields.indexOf(field), 1)
    })
  }
}
</script>

<style lang='scss'>
@import '../../../src/styles/_variable.scss';
.k-form-item.is-error .k-input__inner,
.k-form-item.is-error .k-input__inner:focus,
.k-form-item.is-error .k-textarea__inner,
.k-form-item.is-error .k-textarea__inner:focus{
  border-color:$isDanger;
}
.k-form--label-left .k-form-item__label {
    text-align: left
}

.k-form--label-top .k-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 0 10px
}

.k-form-item__content .k-input-group,
.k-form-item__label {
    vertical-align: middle
}

.k-form-item {
    margin-bottom: 22px
}

.k-form-item::after,
.k-form-item::before {
    display: table;
    content: ""
}

.k-form-item::after {
    clear: both
}

.k-form-item .k-form-item {
    margin-bottom: 0
}

.k-form-item__label {
    text-align: right;
    float: left;
    font-size: 14px;
    color:$mainText;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.k-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px
}

.k-form-item__content::after,
.k-form-item__content::before {
    display: table;
    content: ""
}

.k-form-item__content::after {
    clear: both
}

.k-form-item__error {
    color:$isDanger;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0
}

.k-form-item.is-required .k-form-item__label:before {
    content: '*';
    color: $isDanger;
    margin-right: 4px
}

.k-form-item.is-error .k-input-group__append .k-input__inner,
.k-form-item.is-error .k-input-group__prepend .k-input__inner {
    border-color: transparent
}

.k-form-item.is-success .k-input__inner,
.k-form-item.is-success .k-input__inner:focus,
.k-form-item.is-success .k-textarea__inner,
.k-form-item.is-success .k-textarea__inner:focus {
    border-color:$mainColor;
}

.k-form-item.is-success .k-input-group__append .k-input__inner,
.k-form-item.is-success .k-input-group__prepend .k-input__inner {
    border-color: transparent
}
</style>

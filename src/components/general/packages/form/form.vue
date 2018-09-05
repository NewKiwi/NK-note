<template>
  <!-- class绑定的类名控制form-item的样式 -->
  <form class="nk-form" :class="[
    labelPosition ? 'nk-form--label-' + labelPosition : '',
    { 'nk-form--inline': inline }
  ]">
    <slot></slot>
  </form>
</template>

<script>
  // 分派, Object.assign()的ES5实现
  import objectAssign from '../../src/utils/merge'

  export default {
    name: 'NkForm',

    componentName: 'NkForm',

    provide() {
      return {
        nkForm: this
      }
    },

    props: {
      model: Object,
      rules: Object,
      labelWidth: String,
      labelPosition: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      // 是否行内表单
      inline: Boolean,
      // 是否行内显示校验信息
      inlineMessage: Boolean,
      // 是否显示校验结果反馈图标
      statusIcon: Boolean,
      // 是否显示校验信息
      showMessage: {
        type: Boolean,
        default: true
      },
      size: String,
      disabled: Boolean,
      // 当检验规则改变是否立即进行再次校验，On
      validateOnRuleChange: {
        type: Boolean,
        default: true
      }
    },

    watch: {
      // 侦听rules的改变，然后进行验证
      rules() {
        if (this.validateOnRuleChange) {
          this.validate(() => {})
        }
      }
    },

    data() {
      return {
        // ?表单域字段的内容？
        fields: []
      }
    },

    created() {
      // ？添加表单域字段？
      this.$on('el.form.addField', (file) => {
        this.fields.push(file)
      })
      // ?删除某一个表单域字段？
      this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexof(field), 1)
        }
      })
    },

    methods: {
      // 重置表单域字段为初始值
      resetFileds() {
        if (!this.model) {
          // 判断是否生产环境
          process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Form]model is required for resetFields to work.')
          return false
        }
        // fields中每一项都有resetField方法
        this.fields.forEach((field) => {
          field.resetField()
        })
      },
      clearValidate() {
        this.fields.forEach(field => {
          field.clearValidate()
        })
      },
      // 验证表单字段的内容的有效性
      validate(callback) {
        if (!this.model) {
          console.warn('[Element Warn][Form]model is required for validate to work!')
          return
        }
        let promise
        // ?
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid) {
              valid ? resolve(valid) : reject(valid)
            }
          })
        }

        let valid = true
        let count = 0
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true)
        }
        let invalidFields = {}
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false
            }
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
    }
  }
</script>

<!-- form和form-item的样式如下 -->
<style lang='scss'>
/*display:inline-block ——> 行内表单*/
/*clear 属性定义了元素的哪边上不允许出现浮动元素。在 CSS1 和 CSS2 中，这是通过自动为清除元素（即设置了 clear 属性的元素）增加上外边距实现的。在 CSS2.1 中，会在元素上外边距之上增加清除空间，而外边距本身并不改变。不论哪一种改变，最终结果都一样，如果声明为左边或右边清除，会使元素的上外边框边界刚好在该边上浮动元素的下外边距边界之下。*/

.nk-form--inline .nk-form-item,
.nk-form--inline .nk-form-item__content {
    display: inline-block;
    vertical-align: top
}
.nk-form-item::after,
.nk-form-item__content::after {
    clear: both
}

.nk-form--label-left .nk-form-item__label {
    text-align: left
}

.nk-form--label-top .nk-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 0 10px
}

.nk-form--inline .nk-form-item {
    margin-right: 10px
}

.nk-form--inline .nk-form-item__label {
    float: none;
    display: inline-block
}

.nk-form-item__content .nk-input-group,
.nk-form-item__label {
    vertical-align: middle
}

.nk-form--inline.nk-form--label-top .nk-form-item__content {
    display: block
}

.nk-form-item {
    margin-bottom: 22px
}

.nk-form-item::after,
.nk-form-item::before {
    display: table;
    content: ""
}

.nk-form-item .nk-form-item {
    margin-bottom: 0
}

.nk-form-item--mini.nk-form-item,
.nk-form-item--small.nk-form-item {
    margin-bottom: 18px
}

.nk-form-item .nk-input__validateIcon {
    display: none
}

.nk-form-item--medium .nk-form-item__content,
.nk-form-item--medium .nk-form-item__label {
    line-height: 36px
}

.nk-form-item--small .nk-form-item__content,
.nk-form-item--small .nk-form-item__label {
    line-height: 32px
}

.nk-form-item--small .nk-form-item__error {
    padding-top: 2px
}

.nk-form-item--mini .nk-form-item__content,
.nk-form-item--mini .nk-form-item__label {
    line-height: 28px
}

.nk-form-item--mini .nk-form-item__error {
    padding-top: 1px
}

.nk-form-item__label {
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.nk-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px
}

.nk-form-item__content::after,
.nk-form-item__content::before {
    display: table;
    content: ""
}

.nk-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0
}

.nk-form-item__error--inline {
    position: relative;
    top: auto;
    left: auto;
    display: inline-block;
    margin-left: 10px
}

.nk-form-item.is-required .nk-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px
}

.nk-form-item.is-error .nk-input__inner,
.nk-form-item.is-error .nk-input__inner:focus,
.nk-form-item.is-error .nk-textarea__inner,
.nk-form-item.is-error .nk-textarea__inner:focus {
    border-color: #f56c6c
}

.nk-form-item.is-error .nk-input-group__append .nk-input__inner,
.nk-form-item.is-error .nk-input-group__prepend .nk-input__inner {
    border-color: transparent
}

.nk-form-item.is-error .nk-input__validateIcon {
    color: #f56c6c
}

.nk-form-item.is-success .nk-input__inner,
.nk-form-item.is-success .nk-input__inner:focus,
.nk-form-item.is-success .nk-textarea__inner,
.nk-form-item.is-success .nk-textarea__inner:focus {
    border-color: #67c23a
}

.nk-form-item.is-success .nk-input-group__append .nk-input__inner,
.nk-form-item.is-success .nk-input-group__prepend .nk-input__inner {
    border-color: transparent
}

.nk-form-item.is-success .nk-input__validateIcon {
    color: #67c23a
}

.nk-form-item--feedback .nk-input__validateIcon {
    display: inline-block
}
</style>

<template>
  <label
    class="k-checkbox"
    :class="[
      { 'is-disabled': isDisabled },
      { 'is-checked': isChecked }
    ]"
  >
    <span class="k-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-focus': focus
      }"
    >
      <span class="k-checkbox__inner"></span>
      <input
        v-if="trueLabel || falseLabel"
        class="k-checkbox__original"
        type="checkbox"
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
        class="k-checkbox__original"
        type="checkbox"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
    <span class="k-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
</template>
<script>
  import Emitter from '../../../src/utils/mixins/emitter'

  export default {
    name: 'KCheckbox',

    mixins: [Emitter],

    componentName: 'KCheckbox',

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
        selfModel: false,
        focus: false
      }
    },

    computed: {
      model: {
        get() {
          return this.value !== undefined
              ? this.value : this.selfModel
        },

        set(val) {
          this.$emit('input', val)
          this.selfModel = val
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

      store() {
        return this.value
      },

      isDisabled() {
        return this.disabled || (this.KForm || {}).disabled
      }
    },

    props: {
      value: {},
      label: {},
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },

    methods: {
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
        let value
        if (ev.target.checked) {
          value = this.trueLabel === undefined ? true : this.trueLabel
        } else {
          value = this.falseLabel === undefined ? false : this.falseLabel
        }
        this.$emit('change', value, ev)
      }
    },

    created() {
      this.checked && this.addToStore()
    }
  }
</script>

<style lang="scss">
@import '../../../src/styles/_variable.scss';
.k-checkbox,
.k-checkbox__input {
    display: inline-block;
    position: relative;
    white-space: nowrap
}
.k-checkbox {
    color: #606266;
    font-size: 14px;
    cursor: pointer;
    user-select: none
}
.k-checkbox__input {
    cursor: pointer;
    outline: 0;
    line-height: 1;
    vertical-align: middle
}

.k-checkbox__input.is-disabled .k-checkbox__inner {
    background-color: #edf2fc;
    border-color: #dcdfe6;
    cursor: not-allowed
}

.k-checkbox__input.is-disabled .k-checkbox__inner::after {
    cursor: not-allowed;
    border-color: #c0c4cc
}

.k-checkbox__input.is-disabled .k-checkbox__inner+.k-checkbox__label {
    cursor: not-allowed
}

.k-checkbox__input.is-disabled.is-checked .k-checkbox__inner {
    background-color: #f2f6fc;
    border-color: #dcdfe6
}

.k-checkbox__input.is-disabled.is-checked .k-checkbox__inner::after {
    border-color: #c0c4cc
}
.k-checkbox__input.is-checked .k-checkbox__inner{
    background-color: $mainColor;
    border-color: $mainColor
}
.k-checkbox__input.is-checked .k-checkbox__inner::after {
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1)
}

.k-checkbox__input.is-checked+.k-checkbox__label {
    color:$mainColor;
}

.k-checkbox__input.is-focus .k-checkbox__inner {
    border-color:$mainColor;
}

.k-checkbox__input.is-indeterminate .k-checkbox__inner::before {
    content: '';
    position: absolute;
    display: block;
    background-color: #fff;
    height: 2px;
    -webkit-transform: scale(.5);
    transform: scale(.5);
    left: 0;
    right: 0;
    top: 5px
}

.k-checkbox__input.is-indeterminate .k-checkbox__inner::after {
    display: none
}

.k-checkbox__inner {
    display: inline-block;
    border-radius: 50%;
    position: relative;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    background-color: #fff;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46)
}

.k-checkbox__inner:hover {
    border-color:$mainColor;
}

.k-checkbox__inner::after {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 12px;
    left: 8px;
    position: absolute;
    top: 2px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 5px;
    -webkit-transition: -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) 50ms;
    transition: -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) 50ms;
    transition: transform .15s cubic-bezier(.71, -.46, .88, .6) 50ms;
    transition: transform .15s cubic-bezier(.71, -.46, .88, .6) 50ms, -webkit-transform .15s cubic-bezier(.71, -.46, .88, .6) 50ms;
    -webkit-transform-origin: center;
    transform-origin: center
}

.k-checkbox__original {
    opacity: 0;
    outline: 0;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1
}
</style>


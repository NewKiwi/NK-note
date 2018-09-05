<template>
  <div
    @dragstart.prevent
    :class="[
      'k-input-number',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <span
      class="k-input-number__decrease"
      role="button"
      v-if="controls"
      @click="decrease"
      :class="{'is-disabled': minDisabled}">
      <i :class="`k-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <span
      class="k-input-number__increase"
      role="button"
      v-if="controls"
      @click="increase"
      :class="{'is-disabled': maxDisabled}">
      <i :class="`k-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <k-input
      ref="input"
      :value="currentValue"
      :disabled="inputNumberDisabled"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleInputChange">
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </k-input>
  </div>
</template>
<script>
  import KInput from '../../input'
  import Focus from '../../../src/utils/mixins/focus'

  export default {
    name: 'KInputNumber',
    mixins: [Focus('input')],
    inject: {
      KForm: {
        default: ''
      },
      KFormItem: {
        default: ''
      }
    },
    components: {
      KInput
    },
    props: {
      step: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      value: {},
      disabled: Boolean,
      size: String,
      controls: {
        type: Boolean,
        default: true
      },
      controlsPosition: {
        type: String,
        default: ''
      },
      name: String,
      label: String
    },
    data() {
      return {
        currentValue: 0
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(value) {
          let newVal = value === undefined ? value : Number(value)
          if (newVal !== undefined && isNaN(newVal)) return
          if (newVal >= this.max) newVal = this.max
          if (newVal <= this.min) newVal = this.min
          this.currentValue = newVal
          this.$emit('input', newVal)
        }
      }
    },
    computed: {
      minDisabled() {
        return this._decrease(this.value, this.step) < this.min
      },
      maxDisabled() {
        return this._increase(this.value, this.step) > this.max
      },
      precision() {
        const { value, step, getPrecision } = this
        return Math.max(getPrecision(value), getPrecision(step))
      },
      controlsAtRight() {
        return this.controlsPosition === 'right'
      },
      inputNumberDisabled() {
        return this.disabled || (this.elForm || {}).disabled
      }
    },
    methods: {
      toPrecision(num, precision) {
        if (precision === undefined) precision = this.precision
        return parseFloat(parseFloat(Number(num).toFixed(precision)))
      },
      getPrecision(value) {
        if (value === undefined) return 0
        const valueString = value.toString()
        const dotPosition = valueString.indexOf('.')
        let precision = 0
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1
        }
        return precision
      },
      _increase(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue

        const precisionFactor = Math.pow(10, this.precision)
        // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor)
      },
      _decrease(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue

        const precisionFactor = Math.pow(10, this.precision)

        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor)
      },
      increase() {
        if (this.inputNumberDisabled || this.maxDisabled) return
        const value = this.value || 0
        const newVal = this._increase(value, this.step)
        this.setCurrentValue(newVal)
      },
      decrease() {
        if (this.inputNumberDisabled || this.minDisabled) return
        const value = this.value || 0
        const newVal = this._decrease(value, this.step)
        this.setCurrentValue(newVal)
      },
      handleBlur(event) {
        this.$emit('blur', event)
        this.$refs.input.setCurrentValue(this.currentValue)
      },
      handleFocus(event) {
        this.$emit('focus', event)
      },
      setCurrentValue(newVal) {
        const oldVal = this.currentValue
        if (newVal >= this.max) newVal = this.max
        if (newVal <= this.min) newVal = this.min
        if (oldVal === newVal) {
          this.$refs.input.setCurrentValue(this.currentValue)
          return
        }
        this.$emit('input', newVal)
        this.$emit('change', newVal, oldVal)
        this.currentValue = newVal
      },
      handleInputChange(value) {
        const newVal = value === '' ? undefined : Number(value)
        if (!isNaN(newVal) || value === '') {
          this.setCurrentValue(newVal)
        }
      }
    }
  }
</script>

<style lang='scss'>
@import '../../../src/styles/_variable.scss';
.k-input-number {
  position: relative;
  display: inline-block;
  width: 138px;
  line-height: 38px;
  & .k-input{
    display: block;
  }
  & .k-input__inner{
    -webkit-appearance: none;
    padding-left: 50px;
    padding-right: 50px;
    text-align: center;
    border:none;
  }
  &__decrease,
  &__increase{
    position: absolute;
    z-index: 1;
    top: 0px;
    width: 40px;
    height: auto;
    text-align: center;
    background: #fff;
    color:$mainColor;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid $mainColor;
    border-radius: 50%;
  }
  &__decrease.is-disabled,
  &__increase.is-disabled,{
    color: #c0c4cc;
    cursor: not-allowed;
    border-color:#c0c4cc;
  }
  &__decrease{
    left: 0;
  }
  &__increase{
    right:0;
  }
  &.is-disabled .k-input-number__decrease,
  &.is-disabled .k-input-number__increase{
    color: #c0c4cc;
    cursor: not-allowed;
    border-color:#c0c4cc;
  }
  &.is-disabled .k-input-number__decrease:hover,
  &.is-disabled .k-input-number__increase:hover{
    color: #c0c4cc;
    cursor: not-allowed;
    border-color:#c0c4cc;
  }
  &.is-without-controls .k-input__inner {
      padding-left: 15px;
      padding-right: 15px
  }

  &.is-controls-right .k-input__inner {
      padding-left: 15px;
      padding-right: 50px
  }

  &.is-controls-right &__decrease,
  &.is-controls-right &__increase {
      height: auto;
      line-height: 19px
  }

  &.is-controls-right &__decrease [class*=k-icon],
  &.is-controls-right &__increase [class*=k-icon] {
      -webkit-transform: scale(.8);
      transform: scale(.8)
  }

  &.is-controls-right &__increase {
    border: 1px solid $mainColor;
    border-radius: 50%;
  }

  &.is-controls-right &__decrease {
    right: 0px;
    bottom: 0px;
    top: auto;
    left: auto;
    border: 1px solid $mainColor;
    border-radius: 50%;
  }
}
</style>

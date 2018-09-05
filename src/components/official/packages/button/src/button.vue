<template>
  <button
    @click="handleClick"
    :style="styles"
    :type="nativeType"
    :disabled='disabled'
    :class="[
      'k-button',
      `is-${shape}`,
      `is-${type}`,
      {
        'is-disabled': disabled,
        'is-plain': plain
      }
    ]"
  >
    <span v-if='$slots.default'><slot></slot></span>
    <i :class="icon" v-if='icon'></i>
  </button>
</template>

<script>
export default {
  name: 'KButton',

  props: {
    nativeType: {
      type: String,
      default: 'button'
    },
    shape: {
      type: String,
      default: 'normal'
    },
    type: {
      type: String,
      default: 'primary'
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    plain: Boolean,
    // 以下六个个prop让用户自定义button
    border: {
      type: String,
      default: ''
    },
    padding: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: 'auto'
    },
    bgColor: {
      type: String,
      default: ''
    },
    radius: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },

  computed: {
    styles() {
      const obj = {
        border: this.border,
        padding: this.padding,
        width: this.width,
        backgroundColor: this.bgColor,
        borderRadius: this.radius,
        color: this.color
      }
      return obj
    }
  },

  methods: {
    handleClick(e) {
      if (this.disabled) return
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
  @import '../../../src/styles/_Gmixin.scss';
  @import '../../../src/styles/_variable.scss';
  .k-button{
    border:none;
    @include button;
    &.is-normal{
      padding: 12px 20px;
      border-radius: 4px;
      background-color: $mainColor;
    }
    &.is-round{
      border-radius: 20px;
      padding: 12px 23px
    }
    &.is-circular{
      border-radius: 50%;
      padding:10px;
    }
    &.is-rect{
      padding:10px;
    }
    &.is-primary{
      background-color: $mainColor;
    }
    &.is-danger{
      background-color: $isDanger;
    }
    &.is-warning{
      background-color: $isWarning;
    }
    &.is-text{
      color:$isTip;
      background-color:transparent;
    }
    &.is-plain{
      background-color: transparent;
      border: 1px solid $mainColor;
      color: $mainColor;
    }
    &.is-disabled{
      // pointer-events: none;
      // color:#CCCCCC !important;
      cursor: not-allowed;
      background-color:$placeholderText;
    }
    & span+[class*=k-icon-] {
      margin-left: 5px
    }
  }
</style>

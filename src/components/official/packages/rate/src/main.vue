<template>
  <div
    class="k-rate">
    <span
     class="k-rate__item"
     v-for='item in max'
     :key='item'
     :style="{ cursor: rateDisabled ? 'auto' : 'pointer'}">
      <i
       class="k-rate__icon"
       :class="rateIconClass"
       :style="getIconStyle(item)">
        <i
        v-if='showDecimalIcon(item)'
        :class="rateIconClass"
        class="k-rate__decimal"
        :style='decimalStyle'></i>
      </i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'KRate',

  data() {
    return {
      currentValue: this.value
    }
  },

  props: {
    color: {
      type: String,
      default: '#FFE64B'
    },
    disabledVoidColor: {
      type: String,
      default: '#EFF2F7'
    },
    iconClass: {
      type: String,
      default: 'k-icon-star-on'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 0
    },
    allowHalf: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    rateDisabled() {
      return this.disabled
    },
    rateIconClass() {
      return [this.iconClass]
    },
    decimalStyle() {
      let width = ''
      if (this.allowHalf) {
        width = '50%'
      }
      return {
        color: this.color,
        width
      }
    }
  },

  methods: {
    getIconStyle(item) {
      return { color: item <= this.currentValue ? this.color : this.disabledVoidColor }
    },
    showDecimalIcon(item) {
      const showHalfIcon = this.allowHalf &&
        item <= this.currentValue + 0.5 &&
        item > this.currentValue
      return showHalfIcon
    }
  }
}
</script>

<style lang='scss'>
.k-rate{
  // height: 20px;
  line-height: 1;
  &__item, &__icon{
    position: relative;
    display: inline-block
  }
  &__item{
    font-size: 0;
    vertical-align: middle
  }
  &__icon{
    font-size: 18px;
    margin-right: 6px;
    color:#c0c4cc;
  }
  &__decimal{
    position: absolute;
    top: 0;
    left: 0
  }
  &__decimal{
    display: inline-block;
    overflow: hidden
  }
}
</style>

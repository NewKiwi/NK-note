<template>
  <li
    class="k-simple-menu__item"
    :style="[{ backgroundColor }, itemStyle, hoverStyle]"
    :class="{
      'is-active': active
    }"
    @click="handleClick"
    @mouseenter='hover = true'
    @mouseleave='hover = false'>
    <div class='is-hover-bar' v-if='hoverTransition' :style="hoverTransitionStyle"></div>
    <slot></slot>
    <slot name="title"></slot>
  </li>
</template>

<script>
import Emitter from '../../../src/utils/mixins/emitter'
export default {
  name: 'KSimpleMenuItem',

  inject: ['simpleMenu'],

  props: {
    index: {
      type: String,
      required: true
    },
    route: [String, Object],
    disabled: Boolean,
    allowChoose: {
      type: Boolean,
      default: true
    }
  },
  mixins: [Emitter],
  data() {
    return {
      hover: false
    }
  },
  computed: {
    active() {
      return this.index === this.simpleMenu.activeIndex
    },
    hoverTransition() {
      return this.simpleMenu.hoverTransition
    },
    backgroundColor() {
      return this.simpleMenu.backgroundColor || ''
    },
    activeTextColor() {
      return this.simpleMenu.activeTextColor || ''
    },
    textColor() {
      return this.simpleMenu.textColor || ''
    },
    borderColor() {
      return this.simpleMenu.borderColor
    },
    mode() {
      return this.simpleMenu.mode
    },
    itemStyle() {
      const style = {
        color: this.active ? this.activeTextColor : this.textColor
      }
      if (this.mode === 'horizontal') {
        style.borderBottom = this.active
          ? `2px solid ${this.borderColor}`
          : '2px solid transparent'
      } else if (this.mode === 'vertical') {
        style.borderRight = this.active
          ? `2px solid ${this.borderColor}`
          : '2px solid transparent'
      }
      return style
    },
    hoverStyle() {
      const style = {}
      if (!this.active && !this.disabled && this.hover && !this.hoverTransition) {
        style.color = this.hover ? this.activeTextColor : this.textColor
        if (this.mode === 'horizontal') {
          style.borderBottom = `2px solid ${this.borderColor}`
        } else if (this.mode === 'vertical') {
          style.borderRight = `2px solid ${this.borderColor}`
        }
      }
      return style
    },
    hoverTransitionStyle() {
      const style = {
        backgroundColor: `${this.borderColor}`
      }
      if (!this.active && this.allowChoose && this.hover && this.hoverTransition) {
        if (this.mode === 'horizontal') {
          style.width = `100%`
        } else if (this.mode === 'vertical') {
          style.height = `100%`
        }
      }
      return style
    }
  },
  methods: {
    handleClick() {
      this.$emit('allow-click', this)
      if (!this.disabled) {
        this.dispatch('KSimpleMenu', 'item-click', this)
        this.$emit('click', this)
      }
    }
  },
  created() {
    this.simpleMenu.addItem(this)
  },
  beforeDestroy() {
    this.simpleMenu.removeItem(this)
  }
}
</script>

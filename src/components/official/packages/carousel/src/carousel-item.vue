<template>
  <div
    v-show='ready'
    class="k-carousel__item"
    @click="handleItemClick"
    :class="[
      $parent.type ? `k-carousel__item--${type}` : '',
      {
        'is-animating': animating,
        'is-active': active,
        'is-in-stage': inStage
      }
    ]"
    :style="styles"
    >
    <slot></slot>
  </div>
</template>

<script>
// 暂时不作type为card和type为scrollPane的编写
const TYPE_MAPS = {
  pane: {
    scalePercent: '54%',
    scale: 0.54
  }
}
export default {
  name: 'KCarouselItem',

  data() {
    return {
      translate: 0,
      scale: 1,
      ready: false,
      // 当$parent.type没有值时，animating只控制当前carousel的动画，其他同级组件不存在动画，只做简单的位移
      animating: false,
      active: false,
      inStage: false,
      scalePercent: ''
    }
  },

  props: {
    name: String,
    customPane: Boolean,
    custom: {
      type: Object,
      default: () => {
          return {
            pane: {
              scalePercent: '54%',
              scale: 0.54
            }
          }
      }
    }
  },

  computed: {
    paneScale() {
      return this.$parent.paneScale
    },
    type() {
      return this.$parent.type
    },
    axis() {
      return this.$parent.direction === 'horizontal' ? 'x' : 'y'
    },
    scaleDirection() {
      if (this.$parent.type === 'card') {
        return `scale${this.axis}`
      } else {
        return 'scale'
      }
    },
    styles() {
      const style = {
          msTransform: `translate${this.axis}(${this.translate}px) ${this.scaleDirection}(${this.scale})`,
          webkitTransform: `translate${this.axis}(${this.translate}px) ${this.scaleDirection}(${this.scale})`,
          transform: `translate${this.axis}(${this.translate}px) ${this.scaleDirection}(${this.scale})`,
          width: this.axis === 'x' ? `${this.scalePercent}` : '',
          height: this.axis === 'y' ? `${this.scalePercent}` : ''
        }
      return style
    }
  },

  methods: {
    getScalePercent() {
      let scalePercent = ''
      if (!this.type) {
        return scalePercent
      }
      if (this.type === 'pane') {
        scalePercent = TYPE_MAPS[this.type].scalePercent
      }
      if (this.customPane) {
        scalePercent = this.custom[this.type].scalePercent
      }

      if (this.type === 'scrollPane') {
        scalePercent = this.paneScale
      }
      return scalePercent
    },
    // 思路:要让activeIndex前后有待轮播的元素,并以两边边界(轮播到第一张或最后一张时)进行判断，当没有到边界情况时，其实activeIndex两边一直都有元素，因此讨论activeIndex - index > 1的情况
    // 排列问题，大于两边平均的元素进行移动分配
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1
      } else if (activeIndex === length - 1 && index === 0) {
        return length
      } else if (activeIndex - 1 > index && activeIndex - index >= length / 2) {
        return length + 1
      } else if (activeIndex + 1 < index && index - activeIndex >= length / 2) {
        return -2
      } else {
        return index
      }
    },
    calculatePaneTranslate(index, activeIndex, offset) {
      const scale = this.customPane ? this.custom[this.type].scale : TYPE_MAPS[this.type].scale
      // const scale = TYPE_MAPS[this.type].scale
      // 需优化
      if (index === activeIndex && this.inStage) {
        return offset * (1 - scale) / 2
      } else if (this.inStage && index < activeIndex) {
        return offset * (3 * scale - 1) / 2 * (index - activeIndex)
      } else if (this.inStage && index > activeIndex) {
        return offset * (1 + scale) / 2
      } else if (index < activeIndex) {
        return offset * (1 - 5 * scale) / 2
      } else {
        return offset * (3 * scale + 1) / 2
      }
    },
    calculateScrollPaneTranslate(index, activeIndex, offset, length) {
      if (index === activeIndex) {
        return 0
      } else if ((activeIndex === 0 && index === length - 1) || (activeIndex > 0 && index === activeIndex - 1)) {
        return -1 * offset
      } else if (index > activeIndex) {
        return (index - activeIndex) * offset
      } else if (index < activeIndex) {
        return (index + length - activeIndex) * offset
      }
    },
    // 简单工厂模式
    translateCarosuelItem(index, activeIndex, oldIndex) {
      const offset = this.axis === 'x' ? this.$parent.$el.offsetWidth : this.$parent.$el.offsetHeight
      const length = this.$parent.carouselItems.length
      const type = this.$parent.type
      if (!type && oldIndex !== undefined) {
        this.animating = index === activeIndex || index === oldIndex
      } else if (this.type === 'scrollPane') {
        this.animating = this.getScrollPaneAnimating(index, activeIndex, oldIndex, length)
        // this.animating = index === activeIndex
      }
      if (this.type !== 'scrollPane') {
        // 改变index，调整每一个item的位置，使其无缝衔接
        if (index !== activeIndex && length > 2) {
          index = this.processIndex(index, activeIndex, length)
        }
      }
      if (type === 'pane') {
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1
        this.translate = this.calculatePaneTranslate(index, activeIndex, offset)
        this.active = index === activeIndex
      } else if (type === 'scrollPane') {
        this.active = index === activeIndex
        const customOffset = this.axis === 'x' ? this.$el.offsetWidth : this.$el.offsetHeight
        this.translate = this.calculateScrollPaneTranslate(index, activeIndex, customOffset, length)
      } else {
        this.active = index === activeIndex
        this.translate = offset * (index - activeIndex)
      }
      this.ready = true
    },
    getScrollPaneAnimating(index, activeIndex, oldIndex, length) {
      if (oldIndex === length - 1 && activeIndex === 0) {
        return index === 0
      } else if (oldIndex === 0 && activeIndex === length - 1) {
        return index === activeIndex
      } else if (activeIndex > oldIndex) {
        return index === activeIndex
      } else if (oldIndex > activeIndex) {
        return index === oldIndex
      }
    },
    handleItemClick(e) {
      this.$emit('click', e)
      const parent = this.$parent
      if (parent && parent.type === 'pane') {
        const index = parent.carouselItems.indexOf(this)
        parent.setActiveCarouselItems(index)
      }
    }
  },

  created() {
    this.scalePercent = this.getScalePercent()
    this.$parent && this.$parent.updateCarouselItems()
  },

  destroyed() {
    this.$parent && this.$parent.updateCarouselItems()
  }
}
</script>

<style lang='scss'>
.k-carousel__item{
  height: 100%;
  width:100%;
  top: 0;
  left: 0;
  position: absolute;
  display: inline-block;
  overflow: hidden;
  z-index: 0;
  &.is-active{
    z-index: 2
  }
  &.is-animating{
    transition: transform .4s ease-in-out;
  }
  &--pane{
    transition: transform .4s ease-in-out;
  }
  &--pane.is-in-stage {
    transition: transform .4s ease-in-out;
    cursor: pointer;
    z-index: 2
  }
  &--pane.is-active{
    z-index: 3;
  }
}
</style>

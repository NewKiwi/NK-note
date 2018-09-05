<template>
  <div
    v-show="ready"
    class="nk-carousel__item"
    :class="{
      'is-active': active,
      'nk-carousel__item--card': $parent.type === 'card',
      'is-in-stage': inStage,
      'is-hover': hover,
      'is-animating': animating
    }"
    @click="handleItemClick"
    :style="{
      msTransform: `translateX(${ translate }px) scale(${ scale })`,
      webkitTransform: `translateX(${ translate }px) scale(${ scale })`,
      transform: `translateX(${ translate }px) scale(${ scale })`
    }">
    <div
      v-if="$parent.type === 'card'"
      v-show="!active"
      class="nk-carousel__mask">
    </div>
    <slot></slot>
  </div>
</template>

<script>
  const CARD_SCALE = 0.83
  export default {
    name: 'NkCarouselItem',

    props: {
      name: String,
      label: {
        type: [String, Number],
        default: ''
      }
    },

    data() {
      return {
        hover: false,
        translate: 0,
        scale: 1,
        active: false,
        ready: false,
        inStage: false,
        animating: false
      }
    },

    methods: {
      processIndex(index, activeIndex, length) {
        if (activeIndex === 0 && index === length - 1) {
          return -1
        } else if (activeIndex === length - 1 && index === 0) {
          return length
        } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
          return length + 1
        } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
          return -2
        }
        return index
      },

      calculateTranslate(index, activeIndex, parentWidth) {
        if (this.inStage) {
          // inStage的item本身宽为parentWidth的1/2, 计算偏移，就是：
          // index === activeIndex时，parentWidth * 1/2 * 1/2
          // Math.abs(index - activeIndex)) <= 1时(activeIndex的前后一个)，因为scale的原因，要translateX负数或者正数，负数绝对值为：((1-CARD_SCALE) * 1/2)) * parentWidth * 1/2，正数绝对值为((1-CARD_SCALE) * 1/2)) * parentWidth * 1/2+1/2*parentWidth
          // 三个结合起来：parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4
          return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4
        } else if (index < activeIndex) {
          // scale后，以最左为边界，scale已经产生了左边的偏移距离
          // 左边边界往左的块的translate负数绝对值为:1/2*parentWidth(原来应该偏移的距离) - 1/2 * parentWidth * （(1-CARD_SCALE)/2） (SCALE后产生的多余距离)
          return -(1 + CARD_SCALE) * parentWidth / 4
        } else {
          // 右边边界往右的块的translate正数绝对值为:parentWidth - 1/2 * parentWidth * （(1-CARD_SCALE)/2）（原本是parentWidth的，可是scale后，向右偏移距离变小)
          return (3 + CARD_SCALE) * parentWidth / 4
        }
      },

      translateItem(index, activeIndex, oldIndex) {
        const parentWidth = this.$parent.$el.offsetWidth
        const length = this.$parent.items.length
        if (this.$parent.type !== 'card' && oldIndex !== undefined) {
          this.animating = index === activeIndex || index === oldIndex
        }
        if (index !== activeIndex && length > 2) {
          index = this.processIndex(index, activeIndex, length)
        }
        if (this.$parent.type === 'card') {
          this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1
          this.active = index === activeIndex
          this.translate = this.calculateTranslate(index, activeIndex, parentWidth)
          this.scale = this.active ? 1 : CARD_SCALE
        } else {
          this.active = index === activeIndex
          this.translate = parentWidth * (index - activeIndex)
        }
        this.ready = true
      },

      handleItemClick() {
        const parent = this.$parent
        if (parent && parent.type === 'card') {
          const index = parent.items.indexOf(this)
          parent.setActiveItem(index)
        }
      }
    },

    created() {
      this.$parent && this.$parent.updateItems()
    },

    destroyed() {
      this.$parent && this.$parent.updateItems()
    }
  }
</script>

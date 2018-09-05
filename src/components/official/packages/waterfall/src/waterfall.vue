<template>
  <div class="k-waterfall" :style="{height: height + 'px'}">
    <!-- 动画如何添加？ -->
    <!-- <transition-group name='bottom-in'> -->
    <slot></slot>
    <!-- </transition-group> -->
  </div>
</template>

<script>
export default {
  name: 'KWaterfall',

  componentName: 'KWaterfall',
  data() {
    return {
      items: [],
      positionArray: [],
      height: 0
    }
  },
  provide() {
    return {
      'KWaterfall': this
    }
  },
  watch: {
    items() {
      let positionIndex = 0
      let left = 0
      this.items.forEach((item, index) => {
        if (index < this.columns) {
          left = this.computedItemLeft(index + 1)
          item.setLeft(left)
          this.positionArray.push(item.position.scrollHeight)
        } else {
          const minimum = Math.min(...this.positionArray)
          for (let i = 0, len = this.positionArray.length; i < len; i++) {
              if (minimum === this.positionArray[i]) {
                positionIndex = i
                break
              }
          }

          this.positionArray[positionIndex] = this.positionArray[positionIndex] + item.position.scrollHeight + this.verticalGap
          left = this.computedItemLeft(positionIndex + 1)
          item.setLeft(left)

          const top = minimum + this.verticalGap
          item.setTop(top)
        }
      })
      this.height = Math.max(...this.positionArray)
    }
  },
  props: {
    gutter: {
      type: Number,
      default: 20
    },
    width: {
      type: Number,
      default: 100
    },
    verticalGap: {
      type: Number,
      default: 20
    },
    columns: {
      type: Number,
      default: 3
    }
  },

  methods: {
    computedItemLeft(index) {
      if (index % this.columns === 1) {
        return 0
      } else if (index % this.columns === 0) {
        return (this.columns - 1) * (this.width + this.gutter)
      } else {
        return (index % this.columns - 1) * (this.width + this.gutter)
      }
    },
    updateItem() {
      // console.log(this.$children)
      this.items = this.$children.filter(item => item.$options.componentName === 'KWaterfallItem')
    }
  }
}
</script>

<style lang='scss'>
// .bottom-in-move{
//   transition: all 1s linear;
// }
.k-waterfall{
  position: relative;
  &-item{
    position: absolute;
  }
}
</style>

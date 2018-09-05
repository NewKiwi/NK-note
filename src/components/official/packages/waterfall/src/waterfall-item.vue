<template>
<!-- 应用render编写，先做测试，然后修改 -->
  <!-- <transition-group :tag='tag' :name='name'>
    <slot></slot>
  </transition-group> -->
  <div class="k-waterfall-item" ref='item' :style="style">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'KWaterfallItem',

  componentName: 'KWaterfallItem',

  inject: ['KWaterfall'],

  data() {
    return {
      position: {}
    }
  },
  computed: {
    style() {
      const style = {
        width: `${this.KWaterfall.width}px`,
        left: `${this.position.left}px`,
        top: `${this.position.top ? this.position.top : 0}px`
      }
      return style
    }
  },
  methods: {
    setLeft(left) {
      this.$set(this.position, 'left', left)
    },
    setTop(top) {
      this.$set(this.position, 'top', top)
    }
  },
  mounted() {
    this.$nextTick(() => {
      const scrollHeight = this.$refs.item.scrollHeight
      this.$set(this.position, 'scrollHeight', scrollHeight)
      this.KWaterfall.updateItem()
    })
  }
}
</script>

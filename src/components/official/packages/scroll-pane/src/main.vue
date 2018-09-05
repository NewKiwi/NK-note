<template>
  <div class="k-scroll-pane">
    <slot name='arrowLeft'>
      <k-button class="k-scroll-pane__arrow k-scroll-pane__arrow--left" bgColor='#24252B' shape='circular' icon="k-icon-arrow-left" @click="transformPane('left')"></k-button>
    </slot>
    <div class="k-scroll-pane__container" ref='container'>
      <div class="k-scroll-pane__wrapper"
        ref='wrapper'
        :style="{transform: `translateX(${translate}px)`}"
      >
        <slot></slot>
      </div>
    </div>
    <slot name='arrowRight'>
      <k-button class="k-scroll-pane__arrow k-scroll-pane__arrow--right" bgColor='#24252B' shape='circular' icon="k-icon-arrow-right" @click="transformPane('right')"></k-button>
    </slot>
  </div>
</template>

<script>
import KButton from '../../button/src/button'
export default {
  name: 'KScrollPane',

  data() {
    return {
      translate: 0,
      wrapperOffset: 0,
      containerOffset: 0,
      scrollOffset: 0
    }
  },
  components: {
    KButton
  },
  props: {
    step: {
      type: Number,
      default: 0
    }
  },
  computed: {
    mode() {
      return this.step ? 'step' : 'wrapperOffset'
    }
  },
  methods: {
    transformPane(orientation) {
      const avaiableOffset = this.wrapperOffset - this.containerOffset
      if (this.wrapperOffset <= this.containerOffset) return false
      if (this.step && this.step > avaiableOffset) throw new Error('step must lower than the difference between wrapper\'s offsetWidth and container\'s offsetWidth')
      if (orientation === 'right') {
        this.transformRight()
      } else if (orientation === 'left') {
        this.transformLeft()
      }
    },
    transformLeft() {
      const translate = Math.abs(this.translate)
      if (this.translate === 0) {
        return false
      } else if (translate >= this[this.mode]) {
        this.translate = this.translate + this[this.mode]
      } else if (translate < this[this.mode]) {
        this.translate = 0
      }
    },
    transformRight() {
      const avaiableOffset = this.wrapperOffset - this.containerOffset
      const distance = avaiableOffset - Math.abs(this.translate)
      // console.log(distance, this.wrapperOffset)
      if (distance < this[this.mode]) {
        this.translate = this.translate - distance
      } else if (distance >= this[this.mode]) {
        this.translate = this.translate - this[this.mode]
      }
    }
  },
  mounted() {
    this.$nextTick(_ => {
      this.wrapperOffset = this.$refs.wrapper.offsetWidth
      this.containerOffset = this.$refs.container.offsetWidth
    })
  }
}
</script>

<style lang='scss' scoped>
.k-scroll-pane{
  overflow: hidden;
  padding:0 50px;
  position: relative;
  &__container{
    overflow: hidden;
  }
  &__wrapper{
    float:left;
    white-space: nowrap;
    transition: transform .5s linear;
  }
  &__arrow{
    position: absolute;
    top: 5px;
    cursor: pointer;
    font-size: 30px;
    &--left{
      left:0;
    }
    &--right{
      right: 0;
    }
  }
}
</style>

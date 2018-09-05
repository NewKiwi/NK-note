<template>
  <div class="k-lazyload">
    <div class="k-lazyload__loading" v-if='show'>
      <k-svg icon-class="img-loading"></k-svg>
    </div>
    <img class='k-lazyload__img' :src="activeSrc" :alt="alt" ref="img" @click='handleClick'>
  </div>
</template>

<script>
import { getElementPosition } from '../../../src/utils/dom'
export default {
  name: 'KLazyload',

  componentName: 'KLazyload',

  data() {
    return {
      isDone: false,
      activeSrc: '',
      imgOffset: 0,
      show: true
    }
  },
  props: {
    imgSrc: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'hide'
    }
  },
  watch: {
    imgSrc(val) {
      this.activeSrc = val
    }
  },
  methods: {
    setSrc() {
      // console.log(this.isDone)
      if (!this.isDone) {
        this.activeSrc = this.imgSrc
        this.isDone = true
        if (this.mode === 'del') {
          this.show = false
        }
      }
    },
    loadImg(offset) {
      this.imgOffset = getElementPosition(this.$refs.img)
      if (this.imgOffset.y <= offset) {
        this.setSrc()
      }
    },
    handleClick(e) {
      this.$emit('click', e)
    }
  },
  created() {
    this.$on('load', this.loadImg)
  },
  mounted() {
    this.$nextTick(_ => {
      // const offset = document.getElementsByClassName('k-scrollbar__view')[0].clientHeight
      const offset = document.body.clientHeight
      this.loadImg(offset)
    })
  }
}
</script>

<style lang='scss'>
.k-lazyload{
  width: 100%;
  height: 100%;
  min-height: 80px;
  position: relative;
  &__loading{
    position: absolute;
    width: 100%;
    background-color:#EEEEEE;
    top:0;
    left:0;
    bottom:0;
    z-index: -1;
    .svg-icon{
      width: 60px;
      height: 60px;
      position: absolute;
      left:50%;
      top: 50%;
      margin-left:-30px;
      margin-top: -30px;
    }
  }
  &__img{
    background: transparent;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
</style>

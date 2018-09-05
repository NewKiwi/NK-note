<template>
  <div
    class="k-carousel"
    :class="[
      type ? `k-carousel--${type}` : ''
    ]"
    @mouseenter.stop='handleMouseEnter'
    @mouseleave.stop='handleMouseLeave'>
    <div
    class="k-carousel__container"
    :style="{ height: height }">
      <slot name="arrow">
        <transition name='carousel-arrow-left'>
          <k-button
          v-if="renderHorizontalArrow"
          v-show="showArrow === 'always' || hover"
          shape="circular"
          icon="k-icon-arrow-left"
          bg-color="rgba(0, 0, 0, .98)"
          class="k-carousel__arrow k-carousel__arrow--left"
          @click.stop="throttleArrowClick(activeIndex - 1)"
          >
          </k-button>
        </transition>
        <transition name='carousel-arrow-right'>
          <k-button
          v-if="renderHorizontalArrow"
          v-show="showArrow === 'always' || hover"
          shape="circular"
          icon="k-icon-arrow-right"
          bg-color="rgba(0, 0, 0, .98)"
          class="k-carousel__arrow k-carousel__arrow--right"
          @click.stop="throttleArrowClick(activeIndex + 1)">
          </k-button>
        </transition>
        <transition name='carousel-arrow-up'>
          <k-button
          v-if="renderVerticalArrow"
          v-show="showArrow === 'always' || hover"
          shape="circular"
          icon="k-icon-arrow-up"
          bg-color="rgba(0, 0, 0, .98)"
          class="k-carousel__arrow k-carousel__arrow--up"
          @click.stop="throttleArrowClick(activeIndex - 1)">
          </k-button>
        </transition>
        <transition name='carousel-arrow-down'>
          <k-button
          v-if="renderVerticalArrow"
          v-show="showArrow === 'always' || hover"
          shape="circular"
          icon="k-icon-arrow-down"
          bg-color="rgba(0, 0, 0, .98)"
          class="k-carousel__arrow k-carousel__arrow--down"
          @click.stop="throttleArrowClick(activeIndex + 1)">
          </k-button>
        </transition>
      </slot>
      <slot></slot>
    </div>
    <slot name='indicator'>
      <ul
        class="k-carousel__indicators"
        v-if='indicator'
        :class="{ 'k-carousel__indicators--outside': indicatorPosition === 'outside' || type === 'pane' }">
        <li
          v-for="(item, index) in carouselItems"
          :key='index'
          class="k-carousel__indicator"
          :class="{ 'is-active': index === activeIndex }"
          @mouseenter="throttleIndicatorHover(index)"
          @click.stop="handleIndicatorClick(index)"
          >
          <button class="k-carousel__button"></button>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce'
import { addResizeListener, removeResizeListener } from '../../../src/utils/resize-event'
import kButton from '../../button'

export default {
  name: 'KCarousel',

  components: { kButton },

  props: {
    type: String,
    // 初始化轮播首项
    direction: {
      type: String,
      default: 'horizontal'
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    delay: {
      type: Number,
      default: 3000
    },
    // 值可为：hover, always, never
    showArrow: {
      type: String,
      default: 'hover'
    },
    indicator: {
      type: Boolean,
      default: true
    },
    // indictaor的位置,outside或者其他
    indicatorPosition: String,
    // 指示器触发事件的放式
    trigger: {
      type: String,
      default: 'click'
    },
    paneScale: {
      type: String,
      default: '25%'
    }
  },

  data() {
    return {
      carouselItems: [],
      hover: false,
      activeIndex: -1,
      timer: null
    }
  },

  watch: {
    // 当carouselItems动态改变
    carouselItems(val) {
      if (val.length > 0) this.setActiveCarouselItems(this.initialIndex)
    },
    activeIndex(val, oldVal) {
      this.resetItemPosition(oldVal)
      this.$emit('change', { val, oldVal })
    },
    autoplay(val) {
      val ? this.startTimer() : this.pauseTimer()
    }
  },

  computed: {
    renderHorizontalArrow() {
      return this.showArrow !== 'never' && this.direction === 'horizontal'
    },
    renderVerticalArrow() {
      return this.showArrow !== 'never' && this.direction === 'vertical'
    }
  },

  methods: {
    handleMouseEnter() {
      this.hover = true
      this.pauseTimer()
    },
    handleMouseLeave() {
      this.hover = false
      this.startTimer()
    },
    startTimer() {
      if (this.delay <= 0 || !this.autoplay) return false
      this.timer = setInterval(this.palySlides, this.delay)
    },
    pauseTimer() {
      clearInterval(this.timer)
    },
    palySlides() {
      if (this.activeIndex < this.carouselItems.length - 1) {
        this.activeIndex++
      } else {
        this.activeIndex = 0
      }
    },
    resetItemPosition(oldIndex) {
      this.carouselItems.forEach((item, index) => {
        item.translateCarosuelItem(index, this.activeIndex, oldIndex)
      })
    },
    updateCarouselItems() {
      this.carouselItems = this.$children.filter(child => child.$options.name === 'KCarouselItem')
    },
    setActiveCarouselItems(index) {
      if (typeof index === 'string') {
        const filteredItems = this.carouselItems.filter(item => item.name === index)
        if (filteredItems.length > 0) {
          index = this.carouselItems.indexOf(filteredItems[0])
        }
      }
      index = Number(index)
      if (isNaN(index) || index !== Math.floor(index)) {
        process.env.NODE_ENV !== 'production' &&
        console.warn('[Element Warn][Carousel]index must be an integer.')
        return
      }
      const length = this.carouselItems.length
      const oldIndex = this.activeIndex
      if (index < 0) {
        this.activeIndex = length - 1
      } else if (index >= length) {
        this.activeIndex = 0
      } else {
        this.activeIndex = index
      }
      if (oldIndex === this.activeIndex) {
        this.resetItemPosition(oldIndex)
      }
    },
    prev() {
      this.setActiveCarouselItems(this.activeIndex - 1)
    },
    next() {
      this.setActiveCarouselItems(this.activeIndex + 1)
    },
    handleIndicatorHover(index) {
      if (this.trigger === 'hover' && index !== this.activeIndex) {
        this.activeIndex = index
      }
    },
    handleIndicatorClick(index) {
      this.activeIndex = index
    }
  },
  created() {
    this.throttleArrowClick = throttle(300, true, index => {
      this.setActiveCarouselItems(index)
    })
    this.throttleIndicatorHover = throttle(300, index => {
      this.handleIndicatorHover(index)
    })
  },
  mounted() {
    this.updateCarouselItems()
    this.$nextTick(() => {
      addResizeListener(this.$el, this.resetItemPosition)
      if (this.initialIndex < this.carouselItems.length && this.initialIndex >= 0) {
        this.activeIndex = this.initialIndex
      }
      this.startTimer()
    })
  },
  beforeDestroy() {
    if (this.$el) removeResizeListener(this.$el, this.resetItemPosition)
  }
}
</script>

<style lang='scss'>
.k-carousel{
  overflow-x: hidden;
  overflow-y:hidden;
  position: relative;
  &__container{
    position: relative;
    height: 300px
  }
  &__arrow{
    cursor: pointer;
    -webkit-transition: .3s;
    transition: .3s;
    position: absolute;
    z-index: 10;
  }
  &__arrow--left, &__arrow--right{
    top:50%;
    transform: translateY(-50%);
  }
  &__arrow--up, &__arrow--down{
    left:50%;
    transform: translateX(-50%);
  }
  &__arrow--left{
    left:5px;
  }
  &__arrow--right{
    right:5px;
  }
  &__arrow--up{
    top:5px;
  }
  &__arrow--down{
    bottom:5px;
  }
  &__indicators{
    position: absolute;
    list-style: none;
    bottom: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    z-index: 2
  }
  &__indicators--outside{
    bottom: 26px;
    text-align: center;
    position: static;
    transform: none;
    .k-carousel__indicator:hover button {
      opacity: .64
    }
    button{
      background-color: #c0c4cc;
      opacity: .24
    }
  }
  &__indicator {
    display: inline-block;
    background-color: transparent;
    cursor: pointer;
    padding: 6px 4px
  }

  &__indicator:hover button {
      opacity: .72
  }

  &__indicator.is-active button {
      opacity: 1
  }
  &__button {
    height: auto;
    width: auto;
    padding: 2px 18px;
    font-size: 12px;
    display: block;
    opacity: .48;
    width: 30px;
    height: 2px;
    background-color: #fff;
    border: none;
    outline: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-transition: .3s;
    transition: .3s
  }
}
</style>

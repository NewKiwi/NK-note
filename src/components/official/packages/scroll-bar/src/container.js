import { addResizeListener, removeResizeListener } from '../../../src/utils/resize-event'
import scrollbarWidth from '../../../src/utils/scrollbar-width'
import { toObject } from '../../../src/utils/util'
import Bar from './bar'
import { throttle } from 'throttle-debounce'

export default {
  name: 'KScrollbar',

  components: { Bar },

  props: {
    // 允许自定义container和view的的样式
    containerStyle: {},
    containerClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },

  data() {
    return {
      barSizeWidth: '0',
      barSizeHeight: '0',
      barMoveX: 0,
      barMoveY: 0
    }
  },

  computed: {
    container() {
      return this.$refs.container
    }
  },

  render(h) {
    const gutter = scrollbarWidth()
    let containerStyle = this.containerStyle

    if (gutter) {
      // container的原生滚动条隐藏在container外
      const gutterWidth = `-${gutter}px`
      const gutterStyle = `margin-right: ${gutterWidth}`

      if (Array.isArray(this.containerStyle)) {
        containerStyle = toObject(this.containerStyle)
        containerStyle.marginRight = containerStyle.marginBottom = gutterWidth
      } else if (typeof this.containerStyle === 'string') {
        containerStyle += gutterStyle
      } else {
        containerStyle = gutterStyle
      }
    }
    // container中的内容组件
    const view = h(this.tag, {
      class: ['k-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default)

    // container
    // 无gutter，则原生的scrollbar的width和height为0
    const container = (
      <div
        ref='container'
        style={ containerStyle }
        onScroll={ this.handleScroll }
        class={ [this.containerClass, 'k-scrollbar__container', gutter ? '' : 'k-scrollbar__container--hidden-default'] }>
        { [view] }
      </div>
    )

    // 整体组件
    const scrollBar = ([
      container,
      <Bar
      direction='horizontal'
      move={ this.barMoveX }
      size={ this.barSizeWidth }></Bar>,
     <Bar
      direction='vertical'
      move={ this.barMoveY }
      size={ this.barSizeHeight }></Bar>
    ])
    return h('div', { class: 'k-scrollbar' }, scrollBar)
  },

  methods: {
    handleScroll() {
      const container = this.container

      this.barMoveY = ((container.scrollTop * 100) / container.clientHeight)
      this.barMoveX = ((container.scrollLeft * 100) / container.clientWidth)

      const { scrollTop, scrollLeft } = container

      this.emitScrollEvent({ scrollTop, scrollLeft })
      if (container.scrollHeight === container.scrollTop + container.clientHeight) {
        this.$emit('touch-bottom')
      }
    },
    emitScroll(scroll) {
      this.$emit('barScroll', scroll)
    },
    update() {
      const container = this.container
      if (!container) return

      const heightPercentage = (container.clientHeight * 100 / container.scrollHeight)
      const widthPercentage = (container.clientWidth * 100 / container.scrollWidth)

      this.barSizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : ''
      this.barSizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : ''
    },

    scrollIntoView(scrollTop) {
      this.container.scrollTop = scrollTop
    }
  },
  mounted() {
    this.$nextTick(this.update)
    !this.noresize && addResizeListener(this.$refs.resize, this.update)
  },
  created() {
    this.$on('scroll-into-view', this.scrollIntoView)
    this.emitScrollEvent = throttle(200, false, this.emitScroll)
  },
  beforeDestroy() {
    this.emitScrollEvent = null
    !this.noresize && removeResizeListener(this.$refs.resize, this.update)
  }
}

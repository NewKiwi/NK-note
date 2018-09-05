import { on, off } from '../../../src/utils/dom'
import { BAR_MAP, renderThumbStyle } from './util'

export default {
  name: 'kBar',

  props: {
    direction: {
      type: String,
      default: 'vertical'
    },
    size: String,
    move: Number
  },

  computed: {
    bar() {
      return BAR_MAP[this.direction]
    },

    container() {
      return this.$parent.container
    }
  },

  render(h) {
    const { size, move, bar } = this

    return (
      <div
       class={ ['k-scrollbar__track', 'is-' + bar.key] }
       onMousedown={ this.clickTrackHandler }
       >
        <div
          ref='thumb'
          class='k-scrollbar__thumb'
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({size, move, bar}) }>
        </div>
      </div>
    )
  },

  methods: {
    clickThumbHandler(e) {
      this.startDrag(e)
      // 点击thumb的位置到thumb的最底或者最左的距离，用于handleMousemoveDocument中wrap的scrollTop的
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]))
    },
    startDrag(e) {
      e.stopImmediatePropagation()
      // 按下状态的标注,保证点击bar并且拖动时才触发
      this.clickDown = true

      on(document, 'mousemove', this.handleMousemoveDocument)
      on(document, 'mouseup', this.handleMouseupDocument)
      document.onselectstart = () => false
    },
    handleMousemoveDocument(e) {
      // 保证点击bar并且拖动时才触发
      if (!this.clickDown) return false

      const boundaryLength = this[this.bar.axis]
      if (!boundaryLength) return false

      // 拖动鼠标往上或或往下时，鼠标到container最顶部的距离,该值改变
      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1)
      // 点击thumd内的位置到最高或最左的位置，即点击的thumb的点在X或Y方向的坐标X值或Y值，该值不变
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - boundaryLength)
      // 拖动鼠标往上或或往下时，鼠标到container最顶部的距离 减去 点击位置的距离,即thumb最高点到track最高点的距离，该值不断改变
      // 变动一次为鼠标到点击点的偏移距离，这时候, thumb也要根据这个偏移距离改变其位置
      const thumbPositionPercentage = (offset - thumbClickPosition) / this.$el[this.bar.offset]
      // 触发container的scroll事件，并且能更新bar的位置
      this.container[this.bar.scroll] = thumbPositionPercentage * this.container[this.bar.scrollSize]
    },
    handleMouseupDocument() {
      // 保证点击bar并且拖动时才触发
      this.clickDown = false
      this[this.bar.axis] = 0
      off(document, 'mousemove', this.handleMousemoveDocument)
      document.onselectstart = null
    },
    clickTrackHandler(e) {
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client])
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2)
      const thumbPositionPercentage = (offset - thumbHalf) / this.$el[this.bar.offset]
      // 触发container的scroll事件，并且能更新bar的位置
      this.container[this.bar.scroll] = thumbPositionPercentage * this.container[this.bar.scrollSize]
    }
  },

  // 取消监听，以免对其他组件或页面产生影响
  destroyed() {
    off(document, 'mouseup', this.handleMouseupDocument)
  }
}

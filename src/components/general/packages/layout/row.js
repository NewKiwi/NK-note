// render(h)的h: 它来自单词 hyperscript，这个单词通常用在 virtual-dom 的实现中。Hyperscript 本身是指
// 生成HTML 结构的 script 脚本，因为 HTML 是 hyper-text markup language 的缩写(超文本标记语言)
//
// 状态class绑定： is
//
// class绑定，数组项加对象或者数组嵌套，或者对象嵌套
export default {
  name: 'NkRow',

  componentName: 'NkRow',

  props: {
    gutter: Number,

    tag: {
      type: String,
      default: 'div'
    },

    type: String,

    justify: {
      type: String,
      default: 'start'
    },

    align: {
      type: String,
      default: 'start'
    }
  },

  computed: {
    style() {
      const obj = {}
      if (this.gutter) {
        obj.marginLeft = `-${this.gutter / 2}px`
        obj.marginRight = obj.marginLeft
      }
      return obj
    }
  },

  render(h) {
    return h(this.tag, {
      class: [
        'nk-row',
        this.justify !== 'start' ? `is-justify-${this.justify}` : '',
        this.align !== 'top' ? `is-align-${this.align}` : '',
        { 'nk-row--flex': this.type === 'flex' }
      ],
      style: this.style
    }, this.$slots.default)
  }
}

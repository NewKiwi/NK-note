// this[variable]访问对象， [xs,sm,md,lg,xl]的遍历中,
export default {
  name: 'Nk-row',

  componentName: 'NkRow',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    span: {
      type: Number,
      default: 24
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },

  computed: {
    // 不能这样写，要保证能循环到最顶层的row,并且保证有父元素
    // style() {
    //   const obj = {}
    //   if (this.$parent.gutter) {
    //     obj.paddingLeft = `${this.gutter / 2}px`
    //     obj.paddingRight = paddingLeft
    //   }
    // }
    gutter() {
      let parent = this.$parent
      while (parent && parent.$options.componentName !== 'NkRow') {
        parent = parent.$parent
      }
      return parent.gutter ? parent.gutter / 2 : 0
    }
  },

  render(h) {
    const classList = []
    const style = {}
    const colSize = ['xs', 'sm', 'md', 'lg', 'xl']
    const colType = ['span', 'offset', 'pull', 'push']
    colType.forEach((item) => {
      if (this[item] || this[item] === 0) {
        classList.push(
          item === 'span'
          ? `nk-col-${this[item]}`
          : `nk-col-${item}-${this[item]}`)
      }
    })

    colSize.forEach((size) => {
      if (typeof this[size] === 'number') {
        classList.push(`nk-col-${size}-${this[size]}`)
      } else {
        const props = this[size]
        Object.keys(props).forEach((prop) => {
          classList.push(
            prop === 'span'
            ? `nk-col-${size}-${props[prop]}`
            : `nk-col-${size}-${prop}-${props[prop]}`)
        })
      }
    })

    return h(this.tag, {
      class: [classList, 'nk-col'],
      style
    }, this.$slots.default)
  }
}

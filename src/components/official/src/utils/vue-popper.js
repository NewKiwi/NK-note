import {
  PopupManager
} from './popup'
import PopperJS from './popper.js'

const stop = e => e.stopPropagation()

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
/**
 * $refs.reference 和 $refs.popper都是文档节点
 * @param {Boolean} [options.removeOnDestroy=false]
 * popper的options中，当你想要在调用 `destroy` 方法时自动移除 popper 时，应当将此项设置为 true。
 */
export default {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: {
      type: Number,
      default: 35
    },
    transition: String,
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          // 是否开启GPU渲染
          modifiers: {
            computeStyle: {
              gpuAcceleration: false
            }
          }
        }
      }
    }
  },

  data() {
    return {
      showPopper: false,
      currentPlacement: ''
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val
        this.$emit('input', val)
      }
    },

    showPopper(val) {
      val ? this.updatePopper() : this.destroyPopper()
      this.$emit('input', val)
    }
  },

  methods: {
    createPopper() {
      // console.log(this.$isServer)
      if (this.$isServer) return
      // 位置
      this.currentPlacement = this.currentPlacement || this.placement
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return
      }

      const options = Object.assign({}, this.popperOptions)
      const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper
      let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference

      // 没有refernce时
      if (!reference &&
        this.$slots.reference &&
        this.$slots.reference[0]) {
        // $slots.xxx.elm指的是dom节点？
        reference = this.referenceElm = this.$slots.reference[0].elm
      }

      if (!popper || !reference) return
      // 是否显示箭头，通常默认为真
      if (this.visibleArrow) this.appendArrow(popper)
      // 是否插入至body，通常默认为真
      if (this.appendToBody) document.body.appendChild(this.popperElm)

      // 为什么要执行destroy,这是要摧毁全部popper重新创建立？
      // https://www.jianshu.com/p/859a75a98270
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy()
      }

      // popper的位置
      options.placement = this.currentPlacement
      // popper相对于原位置的偏移量
      options.offset = this.offset
      // popper箭头元素的偏移量，为什么默认35?
      options.arrowOffset = this.arrowOffset
      options.modifiers = {
        computeStyle: {
          gpuAcceleration: false
        }
      }
      // 创建popper实例
      this.popperJS = new PopperJS(reference, popper, options)
      // popperJS执行函数
      // console.log(this.popperJS)
      // this.popperJS.onCreate(_ => {
      //   this.$emit('created', this)
      //   this.resetTransformOrigin()
      //   // 为什么要updatePopper?改变nextZIndex是为了？
      //   this.$nextTick(this.updatePopper)
      // })
      this.popperJS.options.onCreate(_ => {
        this.$emit('created', this)
        this.resetTransformOrigin()
        // 为什么要updatePopper?改变nextZIndex是为了？
        this.$nextTick(this.updatePopper)
      })
      // 触发update
      if (typeof options.onUpdate === 'function') {
        this.popperJS.onUpdate(options.onUpdate)
      }
      // popperJS的popper指向创建的插入到dom中的popper
      this.popperJS.popper.style.zIndex = PopupManager.nextZIndex()
      // 组织click组件的传播
      this.popperElm.addEventListener('click', stop)
    },

    updatePopper() {
      const popperJS = this.popperJS
      if (popperJS) {
        popperJS.update()
        if (popperJS.popper) {
          popperJS.popper.style.zIndex = PopupManager.nextZIndex()
        }
      } else {
        this.createPopper()
      }
    },

    doDestroy(forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin()
      }
    },

    // popper变换的原点
    resetTransformOrigin() {
      if (!this.transformOrigin) return
      const placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }
      const placement = this.popperJS.popper.getAttribute('x-placement').split('-')[0]
      const origin = placementMap[placement]
      // 收起和展开的效果
      this.popperJS.popper.style.transformOrigin = typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`
    },

    // hash的目的是？
    appendArrow(element) {
      let hash
      if (this.appended) {
        return
      }

      this.appended = true

      for (const item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name
          break
        }
      }

      const arrow = document.createElement('div')

      if (hash) {
        arrow.setAttribute(hash, '')
      }
      arrow.setAttribute('x-arrow', '')
      arrow.className = 'popper__arrow'
      element.appendChild(arrow)
    }
  },

  beforeDestroy() {
    this.doDestroy(true)
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop)
      document.body.removeChild(this.popperElm)
    }
  },

  // call destroy in keep-alive mode
  deactivated() {
    this.$options.beforeDestroy[0].call(this)
  }
}

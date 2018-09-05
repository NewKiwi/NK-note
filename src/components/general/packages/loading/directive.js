import Vue from 'vue'
import Loading from './loading.vue'
import { addClass, removeClass, getStyle } from '../../src/utils/dom'
import { PopupManager } from '../../src/utils/popup'
import afterLeave from '../../src/utils/after-leave'

// Vue构造器创建子类
const Mask = Vue.extend(Loading)

const loadingDirective = {}

loadingDirective.install = Vue => {
  // 服务端不进行指令定义
  if (Vue.prototype.$isServer) return

  const toggleLoading = (el, binding) => {
    // 通过binding.value控制loading的显隐
    if (binding.value) {
      Vue.nextTick(() => {
        // 判断全屏还是非全屏loading
        if (binding.modifiers.fullscreen) {
          // body的position和overflow样式
          el.originalPosition = getStyle(document.body, 'position')
          el.originalOverflow = getStyle(document.body, 'overflow')

          console.log('test style', el.originalPosition, el.originalOverflow)
          // 设置loading的z-index
          el.maskStyle.zIndex = PopupManager.nextZIndex()

          addClass(el.mask, 'is-fullscreen')
          // 插入loading到指定地方
          insertDom(document.body, el, binding)
        } else {
          removeClass(el.mask, 'is-fullscreen')

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position')

            const topAndLeft = ['top', 'left']
            topAndLeft.forEach(property => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
              // console.log(el.getBoundingClientRect())
              el.maskStyle[property] = el.getBoundingClientRect()[property] +
                document.body[scroll] +
                document.documentElement[scroll] -
                parseInt(getStyle(document.body, `margin-${property}`), 10) +
                'px'
            })

            const heightAndWidth = ['height', 'width']
            heightAndWidth.forEach(property => {
              el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px'
            })

            insertDom(document.body, el, binding)
          } else {
            el.originalPosition = getStyle(el, 'position')
            insertDom(el, el, binding)
          }
        }
      })
    } else {
      /**
       * 每一次loading为false，都执行一次这个函数
       * 目的是解决快速开关Loading所遇到的问题？类似于防抖动？
       * 过程：当binding Value为false时,instance.visible为false, el.instance.hidden为true,
       * 300 + 100毫秒后执行afterLeave中的回调函数
       */
      afterLeave(el.instance, _ => {
        el.domVisible = false
        const target = binding.modifiers.fullscreen || binding.modifiers.body
          ? document.body
          : el
        removeClass(target, 'nk-loading-parent--relative')
        removeClass(target, 'nk-loading-parent--hidden')
        el.instance.hiding = false
      }, 300, true)
      el.instance.visible = false
      el.instance.hiding = true
    }
  }

  // 用el.domVisible来判断是否插入到DOM，toggleLoading一开始是判断了binding Value的值，初始化el.domVisible为false
  // el.instance.hiding用来判断是否$emit('after-leave')
  const insertDom = (parent, el, binding) => {
    if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
      Object.keys(el.maskStyle).forEach(property => {
        el.mask.style[property] = el.maskStyle[property]
      })

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'nk-loading-parent--relative')
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'nk-loading-parent--hidden')
      }
      el.domVisible = true

      parent.appendChild(el.mask)
      Vue.nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave')
        } else {
          el.instance.visible = true
        }
      })
      el.domInserted = true
    }
  }

  // 定义loading指令
  Vue.directive('loading', {
    // 第一次绑定到元素时如果binding.value为false，不会把$el插入到dom
    bind: function(el, binding, vnode) {
      // el为指令绑定的元素（DOM节点)
      console.log('test el', el)

      /* binding为对象，包含绑定的指令的一些属性*/
      console.log('test binding', binding)

      /* Vue 编译生成的虚拟节点, 包含了很多属性的一个VNode, 其中下面的vm即vnode.context我认为是指令生成的一个Vue实例, 因此：Vue实例和VNode有什么关联吗 ? Vue实例是VNode的一种?*/
      console.log('test vnode', vnode)

      // 指令绑定元素的一些特性的值
      const textExr = el.getAttribute('element-loading-text')
      const spinnerExr = el.getAttribute('element-loading-spinner')
      const backgroundExr = el.getAttribute('element-loading-background')
      const customClassExr = el.getAttribute('element-loading-custom-class')

      const vm = vnode.context

      //  Vue 编译生成的虚拟节点怎样才有textExr等属性？
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          text: (vm && vm[textExr]) || textExr,
          spinner: (vm && vm[spinnerExr]) || spinnerExr,
          background: (vm && vm[backgroundExr]) || backgroundExr,
          customClass: (vm && vm[customClassExr]) || customClassExr,
          fullscreen: !!binding.modifiers.fullscreen
        }
      })

      /* 控制台输出VueComponent, 挂载在document.createElement('div')上，可是$el是Mask的根元素*/
      console.log('test VueComponent Mask', mask)

      // 将loading组价实例赋值给el,以在其他钩子进行操作
      el.instance = mask
      // mask.$el是实例化mask时的document.createElement('div')吗？不，是根元素，el是挂载的元素
      el.mask = mask.$el
      el.maskStyle = {}

      /* Mask组件实例使用的根 DOM 元素。 类型：HTMLElement */
      console.log('test mask.$el', el.mask)
      // 通过binding.value控制loading的显隐
      binding.value && toggleLoading(el, binding)
    },

    // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有，所以要比较新旧值
    update: function(el, binding) {
      console.log('update')
      // 更新loading内容
      el.instance.setText(el.getAttribute('element-loading-text'))
      // 判断是否有更新
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },

    unbind: function(el, binding) {
      console.log('test el.domInserted', el)
      console.log('is unbind')
      // el.domInserted指的是什么
      if (el.domInserted) {
        el.mask &&
        el.mask.parentNode &&
        el.mask.parentNode.removeChild(el.mask)
        toggleLoading(el, { value: false, modifiers: binding.modifiers })
      }
    }
  })
}

export default loadingDirective

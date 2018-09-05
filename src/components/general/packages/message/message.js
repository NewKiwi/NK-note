import Vue from 'vue'
import Main from './message.vue'
import { PopupManager } from '../../src/utils/popup'
import { isVNode } from '../../src/utils/vdom'
const MessageConstructor = Vue.extend(Main)

let instance
let seed = 1

const instances = []

const Message = function(options) {
  // 服务器不渲染
  if (Vue.prototype.$isServer) return
  options = options || {}
  // 传入字符串默认为选项的message属性的值
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  const userOnClose = options.onClose
  const id = 'message_' + seed++

  // 调用用来关闭message
  options.onClose = function() {
    Message.close(id, userOnClose)
  }
  instance = new MessageConstructor({
    data: options
  })
  instance.id = id

  // instance.$slots为{}, instance为VueComponent
  console.log(instance)

  // instance.message为字符串，即不会触发isVNode这个判断
  // /test/message路由中，options的message为'测试message和PopupManager'，因此显示默认的的slot,此时，instance.$slots为{}
  console.log(typeof instance.message)

  // 这种方式指的是: message可以是VNode, $slots中属性的值也只能是VNode的集合, VNode实际上也是一个对象
  if (isVNode(instance.message)) {
    instance.$slots.default = [instance.message]
    instance.message = null
  }

  console.log(instance.$el)
  console.log(instance.$mount())

  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  instance.dom.style.zIndex = PopupManager.nextZIndex()

  // 测试nextZIndex()
  console.log(PopupManager)

  instances.push(instance)
  return instance.vm
}

// 创建Message.type()方法
const messageType = ['success', 'warning', 'info', 'error']
messageType.forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

// 增加了删除某个实例的方法
Message.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i])
      }
      instances.splice(i, 1)
      break
    }
  }
}

// 增加了删除全部实例的方法
Message.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close()
  }
}

export default Message

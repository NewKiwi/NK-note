import alert from './packages/alert/alert'
import button from './packages/button/button'
import buttonGroup from './packages/button/button-group'
import checkbox from './packages/checkbox/checkbox'
import checkboxGroup from './packages/checkbox/checkbox-group'
import checkboxButton from './packages/checkbox/checkbox-button'
import container from './packages/container/container'
import aside from './packages/container/aside'
import footer from './packages/container/footer'
import header from './packages/container/header'
import main from './packages/container/main'
import form from './packages/form/form'
import formItem from './packages/form/form-item'
import icon from './packages/icon'
import input from './packages/input/input'
import radio from './packages/radio/radio'
import radioButton from './packages/radio/radio-button'
import radioGroup from './packages/radio/radio-group'
import collapse from './packages/collapse/collapse'
import collapseItem from './packages/collapse/collapse-item'

import col from './packages/layout/col'
import row from './packages/layout/row'

import loadingDirective from './packages/loading/directive'
import message from './packages/message/message'
import notification from './packages/notification/notification'

const components = [
  alert,
  button,
  buttonGroup,
  checkbox,
  checkboxGroup,
  checkboxButton,
  container,
  aside,
  footer,
  header,
  main,
  form,
  formItem,
  icon,
  input,
  radio,
  radioButton,
  radioGroup,
  col,
  row,
  collapse,
  collapseItem
]

// 可以用Vue.use使用库
const install = function(Vue) {
  // 返回的数组是什么？
  components.map(component => {
    Vue.component(component.name, component)
  })
  /* 多个对象，应该不是VNode,我认为是多个组件实例*/
  console.log(components)

  Vue.use(loadingDirective)

  const ELEMENT = {}
  // ELEMENT.size = opts.size || '';

  Vue.prototype.$ELEMENT = ELEMENT

  Vue.prototype.$notify = notification
  Vue.prototype.$message = message
}

export default install

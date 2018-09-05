import Popover from './src/main'
import directive from './src/directive'
import Vue from 'vue'

Vue.directive('popover', directive)
Popover.directive = directive

Popover.install = function(Vue) {
  Vue.directive('popover', directive)
  Vue.component(Popover.name, Popover)
}
export default Popover

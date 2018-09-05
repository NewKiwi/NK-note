// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import NkUi from '@/components/general'

import OfficialUi from '@/components/official'

// import '@/components/general/styles/index.css'
import '@/components/official/src/styles/index.scss'

Vue.use(NkUi)
Vue.use(OfficialUi)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

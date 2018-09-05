import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import-' + process.env.NODE_ENV + '.js')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/test/loading', component: _import('test/general/loading') },
    { path: '/test/message', component: _import('test/general/message') },
    { path: '/test/collapse', component: _import('test/general/collapse') },
    { path: '/test/popup', component: _import('test/general/popup') },
    { path: '/official/button', component: _import('test/official/button') },
    { path: '/official/breadcrumb', component: _import('test/official/breadcrumb') },
    { path: '/official/scrollBar', component: _import('test/official/scroll-bar') },
    { path: '/official/carousel', component: _import('test/official/carousel') },
    { path: '/official/simpleMenu', component: _import('test/official/simple-menu') }
  ]
})

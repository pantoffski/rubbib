import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/MainPage'
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: '/',
  routes: [{
    path: '/',
    name: 'mainPage',
    component: mainPage
  }, {
    path: '*',
    redirect: '/'
  }
  ]
})

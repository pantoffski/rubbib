require('./critical/critical.less');
require('./css/style.less');
import axios from 'axios';
import Vue from 'vue';
import App from './App.vue'
import router from './ext/router.js'
import store from './ext/store.js'
import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://localhost:3000', store);
Vue.prototype.$http = axios;
//Vue.http.options.root = 'http://localhost';
// Vue.config.productionTip = false;
// Vue.http.options.emulateHTTP = true;
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
// window.App=App;
//window.Vue = Vue;

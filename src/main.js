import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueYoutube from 'vue-youtube'
import './assets/sass/main.sass'
Vue.use(VueYoutube)
global.axios = require('axios')
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

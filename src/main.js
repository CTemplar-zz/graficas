import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueChart from './plugins/vue-chart'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  vueChart,
  render: function (h) { return h(App) }
}).$mount('#app')

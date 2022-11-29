import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as zrender from 'zrender'
import * as echarts from 'echarts'
Vue.config.productionTip = false
Vue.prototype.zrender = zrender
Vue.prototype.$echarts = echarts
new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')

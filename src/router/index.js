import Vue from 'vue'
import Router from 'vue-router'
// import BlockReplicating from '@/components/BlockReplicating'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'App'
    }
  ]
})

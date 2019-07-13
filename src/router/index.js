import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import EditEntry from '@/components/EditEntry'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/edit',
      name: 'Edit',
      component: EditEntry,
      props: true
    }
  ]
})

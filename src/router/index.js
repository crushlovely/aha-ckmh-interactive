import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import V2View from '../views/V2View.vue'
import V3View from '../views/V3View.vue'

const router = createRouter({
  history: process.env.NODE_ENV === 'production' ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/v2',
      name: 'v2',
      component: V2View,
    },
    {
      path: '/v3',
      name: 'v3',
      component: V3View,
    },
  ],
})

export default router

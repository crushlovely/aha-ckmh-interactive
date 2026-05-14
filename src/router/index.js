import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import V2View from '../views/V2View.vue'
import V3View from '../views/V3View.vue'
import V4View from '../views/V4View.vue'
import V5View from '../views/V5View.vue'
import V7View from '../views/V7View.vue'
import V8View from '../views/V8View.vue'

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
    {
      path: '/v4',
      name: 'v4',
      component: V4View,
    },
    {
      path: '/v5',
      name: 'v5',
      component: V5View,
    },
    {
      path: '/v7',
      name: 'v7',
      component: V7View,
    },
    {
      path: '/v8',
      name: 'v8',
      component: V8View,
    },
  ],
})

export default router

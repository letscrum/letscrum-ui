/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = [
  { path: '/', component: () => import('@/pages/index.vue') },
  { path: '/123', component: () => import('@/pages/index.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
  routes,
})

export default router

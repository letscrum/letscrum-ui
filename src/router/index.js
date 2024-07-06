/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { useAppStore } from '@/stores/app'

const routes = [
  {
    path: '/projects',
    name: 'Home',
    component: () => import('@/pages/project/ProjectList.vue'),
  },
  {
    path: '/projects/:projectId',
    component: () => import('@/pages/project/ProjectOverview.vue')
  },
  {
    path: '/projects/:projectId/sprints',
    component: () => import('@/pages/project/Sprints.vue'),
  },
  {
    path: '/projects/:projectId/sprints/:sprintId',
    name: 'Sprint',
    component: () => import('@/pages/sprint/Taskboard.vue'),
    // children: [
    //   {
    //     path: 'taskboard',
    //     component: () => import('@/pages/sprint/Taskboard.vue')
    //   },
    //   {
    //     path: 'backlog',
    //     component: () => import('@/pages/sprint/Backlog.vue')
    //   },
    //   {
    //     path: 'capacity',
    //     component: () => import('@/pages/sprint/Capacity.vue')
    //   }
    // ],
  },
  {
    path: '/projects/:projectId/sprints/:sprintId/backlog',
    component: () => import('@/pages/sprint/Backlog.vue'),
  },
  {
    path: '/projects/:projectId/sprints/:sprintId/capacity',
    component: () => import('@/pages/sprint/Capacity.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('@/pages/EmptyPage.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/pages/EmptyPage.vue')
  },
  {
    path: '/others',
    name: 'Others',
    component: () => import('@/pages/EmptyPage.vue')
  },
  {
    path: '/user',
    redirect: '/user/profile',
    name: 'User',
    component: () => import('@/pages/EmptyPage.vue'),
    children: [
      {
        path: 'profile',
        component: () => import('@/pages/EmptyPage.vue')
      },
      {
        path: 'orgs',
        component: () => import('@/pages/EmptyPage.vue')
      },
      {
        path: 'changepassword',
        component: () => import('@/pages/EmptyPage.vue')
      },
      {
        path: 'setting',
        component: () => import('@/pages/EmptyPage.vue')
      }
    ],
  },
  {
    path: '/',
    name: 'SignIn',
    component: () => import('@/pages/SignIn.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useAppStore()
  if (to.name !== 'SignIn') {
    if (!store.isSignedIn) {
      next({ name: 'SignIn' })
    } else {
      next()
    }
  } else {
    if (store.isSignedIn) {
      next({ name: 'Home' })
    } else {
      next()
    }
  }
})

export default router

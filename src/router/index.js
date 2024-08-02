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
    path: '/users',
    name: 'Users',
    component: () => import('@/pages/UserList.vue'),
  },
  {
    path: '/orgs',
    name: 'Orgs',
    component: () => import('@/pages/org/OrgList.vue'),
  },
  {
    path: '/orgs/:orgId/members',
    name: 'OrgMembers',
    component: () => import('@/pages/org/MemberList.vue'),
  },
  {
    path: '/orgs/:orgId/projects',
    name: 'Home',
    component: () => import('@/pages/project/ProjectList.vue'),
  },
  {
    path: '/orgs/:orgId/projects/:projectId',
    component: () => import('@/pages/project/ProjectOverview.vue')
  },
  {
    path: '/orgs/:orgId/projects/:projectId/sprints',
    component: () => import('@/pages/project/Sprints.vue'),
  },
  {
    path: '/orgs/:orgId/projects/:projectId/sprints/:sprintId',
    component: () => import('@/pages/sprint/Sprint.vue'),
    children: [
      {
        path: '',
        components: {
          default: () => import('@/pages/sprint/Taskboard.vue'),
          menu: () => import('@/components/menu/MenuTaskboard.vue')
        }
      },
      {
        path: 'backlog',
        components: {
          default: () => import('@/pages/sprint/Backlog.vue'),
          menu: () => import('@/components/menu/MenuBacklog.vue')
        }
      },
      {
        path: 'capacity',
        components: {
          default: () => import('@/pages/sprint/Capacity.vue'),
          menu: () => import('@/components/menu/MenuCapacity.vue')
        }
      }
    ],
  },
  {
    path: '/test/:tid',
    component: () => import('@/pages/test/TestMain.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/test/TestSub.vue')
      },
      {
        path: 'sub',
        component: () => import('@/pages/test/TestSub.vue')
      }
    ],
  },
  {
    path: '/testdnd',
    component: () => import('@/pages/test/TestDND.vue')
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
      next({ name: 'Orgs' })
    } else {
      next()
    }
  }
})

export default router

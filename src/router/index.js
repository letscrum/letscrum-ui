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
    meta: {
      breadcrumbs: [
        {
          title: 'Orgs',
          to: { name: 'Orgs' }
        }
      ]
    },
  },
  {
    path: '/orgs/:orgId',
    name: 'Org',
    component: () => import('@/pages/org/Org.vue'),
    meta: {
      breadcrumbs: [
        {
          title: 'Orgs',
          to: { name: 'Orgs' }
        },
        {
          title: 'Org',
          to: { name: 'Org' }
        },
      ]
    },
  },
  {
    path: '/orgs/:orgId/projects',
    name: 'Projects',
    component: () => import('@/pages/project/ProjectList.vue'),
    meta: {
      breadcrumbs: [
        {
          title: 'Orgs',
          to: { name: 'Orgs' }
        },
        {
          title: 'Projects',
          to: { name: 'Projects' }
        },
      ]
    },
  },
  {
    path: '/orgs/:orgId/projects/:projectId',
    name: 'Project',
    component: () => import('@/pages/project/Project.vue'),
    meta: {
      breadcrumbs: [
        {
          title: 'Orgs',
          to: { name: 'Orgs' }
        },
        {
          title: 'Projects',
          to: { name: 'Projects' }
        },
        {
          title: 'Project',
          to: { name: 'Project' }
        },
      ]
    },
  },
  {
    path: '/orgs/:orgId/projects/:projectId/sprints/:sprintId',
    name: 'Sprint',
    component: () => import('@/pages/sprint/Sprint.vue'),
    children: [
      {
        path: '',
        name: 'SprintTaskboard',
        components: {
          default: () => import('@/pages/sprint/Taskboard.vue'),
          menu: () => import('@/components/menu/MenuTaskboard.vue')
        },
        meta: {
          breadcrumbs: [
            {
              title: 'Orgs',
              to: { name: 'Orgs' }
            },
            {
              title: 'Projects',
              to: { name: 'Projects' }
            },
            {
              title: 'Project',
              to: { name: 'Project' }
            },
            {
              title: 'Sprint',
              to: { name: 'SprintTaskboard' }
            }
          ]
        },
      },
      {
        path: 'backlog',
        name: 'SprintBacklog',
        components: {
          default: () => import('@/pages/sprint/Backlog.vue'),
          menu: () => import('@/components/menu/MenuBacklog.vue')
        },
        meta: {
          breadcrumbs: [
            {
              title: 'Orgs',
              to: { name: 'Orgs' }
            },
            {
              title: 'Projects',
              to: { name: 'Projects' }
            },
            {
              title: 'Project',
              to: { name: 'Project' }
            },
            {
              title: 'Sprint',
              to: { name: 'SprintBacklog' }
            }
          ]
        },
      },
      {
        path: 'capacity',
        name: 'SprintCapacity',
        components: {
          default: () => import('@/pages/sprint/Capacity.vue'),
          menu: () => import('@/components/menu/MenuCapacity.vue')
        },
        meta: {
          breadcrumbs: [
            {
              title: 'Orgs',
              to: { name: 'Orgs' }
            },
            {
              title: 'Projects',
              to: { name: 'Projects' }
            },
            {
              title: 'Project',
              to: { name: 'Project' }
            },
            {
              title: 'Sprint',
              to: { name: 'SprintCapacity' }
            }
          ]
        },
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
    component: () => import('@/pages/EmptyPage.vue')
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

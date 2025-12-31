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
    meta: { title: 'User List' }
  },
  {
    path: '/orgs',
    name: 'Orgs',
    component: () => import('@/pages/org/OrgList.vue'),
    meta: {
      title: 'Organizations',
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
      title: 'Organization Details',
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
      title: 'Projects',
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
      title: 'Project Details',
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
    path: '/orgs/:orgId/projects/:projectId/backlog',
    name: 'ProjectBacklog',
    component: () => import('@/pages/project/ProjectBacklog.vue'),
    children: [
      {
        path: '',
        name: 'ProductBacklog',
        components: {
          default: () => import('@/pages/sprint/Backlog.vue'),
          sprintMenu: () => import('@/components/menu/MenuSprint.vue'),
          menu: () => import('@/components/menu/MenuBacklog.vue')
        },
        meta: {
          title: 'Backlog',
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
              title: 'Backlog',
              to: { name: 'ProjectBacklog' }
            }
          ]
        },
      },
    ],
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
          sprintMenu: () => import('@/components/menu/MenuSprint.vue'),
          menu: () => import('@/components/menu/MenuTaskboard.vue')
        },
        meta: {
          title: 'Sprint Taskboard',
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
          sprintMenu: () => import('@/components/menu/MenuSprint.vue'),
          menu: () => import('@/components/menu/MenuBacklog.vue')
        },
        meta: {
          title: 'Sprint Backlog',
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
          sprintMenu: () => import('@/components/menu/MenuSprint.vue'),
          menu: () => import('@/components/menu/MenuCapacity.vue')
        },
        meta: {
          title: 'Sprint Capacity',
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
    component: () => import('@/pages/user/UserRoot.vue'),
    meta: { title: 'User Profile' },
    children: [
      {
        path: 'profile',
        component: () => import('@/pages/user/UserProfile.vue')
      },
      {
        path: 'orgs',
        component: () => import('@/pages/EmptyPage.vue')
      },
      {
        path: 'changepassword',
        component: () => import('@/pages/EmptyPage.vue')
      }
    ],
  },
  {
    path: '/',
    name: 'SignIn',
    component: () => import('@/pages/SignIn.vue'),
    meta: { title: 'Sign In' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title ? `${to.meta.title} - Letscrum` : 'Letscrum - Lightweight Scrum & Agile Project Management System'
  document.title = title

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

// Utilities
import { defineStore } from 'pinia'
import Menu from '@/assets/core/menu.json';
import Link from '@/assets/core/link.json';
import Account from '@/assets/core/account.json';
import UserMenu from '@/assets/user/menu.json';

export const useAppStore = defineStore('app', {
  state: () => ({
    language: localStorage.language || window.navigator.language.toLowerCase() || 'cn',
    drawer: false,
    dark: null,
    logoUrl: '/assets/images/logo.png',
    menus: Menu,
    links: Link,
    accounts: Account,
    userMenus: UserMenu,
    breadcrumbs: [],
    user: {
      id: 0,
      name: null,
      email: null,
      isSuperAdmin: false
    },
    token: {
      accessToken: null,
      refreshToken: null
    },
    project: {
      id: 0,
      name: null,
      displayName: null
    },
    sprint: {
      id: 0,
      name: null,
      startDate: null,
      endDate: null
    },
  }),
  getters: {
    isSignedIn: (state) => (!((state.token.accessToken === undefined || state.token.accessToken === null || state.token.accessToken === ''))),
    accessToken: (state) => (state.token.accessToken || ''),
    accounts: (state) => state.accounts,
    userMenus: (state) => state.userMenus,
    user: (state) => state.user,
    token: (state) => state.token,
    project: (state) => state.project,
    sprint: (state) => state.sprint,
    links: (state) => state.links,
    menus: (state) => state.menus,
    logoUrl: (state) => state.logoUrl,
    dark: (state) => state.dark,
    drawer: (state) => state.drawer,
    language: (state) => state.language,
    breadcrumbs: (state) => state.breadcrumbs
  },
  actions: {
    refresh(state, payload) {
      if (payload.accessToken && payload.refreshToken) {
        localStorage.tokenAccessToken = payload.accessToken;
        localStorage.tokenRefreshToken = payload.refreshToken;
        state.user.id = localStorage.userId;
        state.user.name = localStorage.userName;
        state.user.email = localStorage.userEmail;
        state.user.isSuperAdmin = localStorage.userIsSuperAdmin;
        state.token.accessToken = localStorage.tokenAccessToken;
        state.token.refreshToken = localStorage.tokenRefreshToken;
        state.project.id = localStorage.projectId;
        state.project.name = localStorage.projectName;
        state.project.displayName = localStorage.projectDisplayName;
        state.sprint.id = localStorage.sprintId;
        state.sprint.name = localStorage.sprintName;
        state.sprint.startDate = localStorage.sprintStartDate;
        state.sprint.endDate = localStorage.sprintEndDate;
      }
    },
    signIn(state, payload) {
      const {
        id,
        name,
        email,
        isSuperAdmin,
        accessToken,
        refreshToken
      } = payload;
      localStorage.userId = id;
      localStorage.userName = name;
      localStorage.userEmail = email;
      localStorage.userIsSuperAdmin = isSuperAdmin;
      localStorage.tokenAccessToken = accessToken;
      localStorage.tokenRefreshToken = refreshToken;
      state.user = {
        id,
        name,
        email,
        isSuperAdmin
      };
      state.token = {
        accessToken,
        refreshToken
      };
    },
    signOut(state) {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userIsSuperAdmin');
      localStorage.removeItem('tokenAccessToken');
      localStorage.removeItem('tokenRefreshToken');
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      state.user.id = 0;
      state.user.name = null;
      state.user.email = null;
      state.user.isSuperAdmin = null;
      state.token.accessToken = null;
      state.token.refreshToken = null;
      state.project.id = 0;
      state.project.name = null;
      state.project.displayName = null;
      state.breadcrumbs = [];
    },
    setProject(state, payload) {
      const {
        id,
        name,
        displayName
      } = payload;
      localStorage.projectId = id;
      localStorage.projectName = name;
      localStorage.projectDisplayName = displayName;
      state.project = {
        id,
        name,
        displayName
      };
    },
    setSprint(state, payload) {
      const {
        id,
        name,
        startDate,
        endDate
      } = payload;
      localStorage.sprintId = id;
      localStorage.sprintName = name;
      localStorage.sprintStartDate = startDate;
      localStorage.sprintEndDate = endDate;
      state.sprint = {
        id,
        name,
        startDate,
        endDate
      };
    },
    clearProject(state) {
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      state.project.id = 0;
      state.project.name = null;
      state.project.displayName = null;
    },
    setDrawer(state, payload) {
      localStorage.drawer = payload;
      state.drawer = payload;
    },
    toggleDrawer(state) {
      localStorage.drawer = !state.drawer;
      state.drawer = !state.drawer;
    },
    setTheme(state, payload) {
      localStorage.dark = payload;
      localStorage.logoUrl = payload ? '/assets/images/logo-dark.png' : '/assets/images/logo.png';
      state.dark = payload;
      state.logoUrl = state.dark ? '/assets/images/logo-dark.png' : '/assets/images/logo.png';
    },
    setLanguage(state, payload) {
      localStorage.language = payload;
      state.language = payload;
    },
    pushBreadcrumbs(state, payload) {
      state.breadcrumbs.push(payload);
    },
    popBreadcrumbs(state) {
      state.breadcrumbs.slice(0, state.breadcrumbs.length - 1);
    },
    setBreadcrumbs(state, payload) {
      state.breadcrumbs = [...payload];
    },
    clearBreadcrumbs(state) {
      state.breadcrumbs = [];
    }
  },
})

// Utilities
import { defineStore } from 'pinia'
import Menu from '@/assets/core/menu.json';
import Link from '@/assets/core/link.json';
import Account from '@/assets/core/account.json';
import UserMenu from '@/assets/user/menu.json';

export const useAppStore = defineStore('app', {
  state: () => ({
    language: localStorage.language || window.navigator.language.toLowerCase() || 'cn',
    rail: false,
    theme: null,
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
      displayName: null,
      description: null
    },
    sprint: {
      id: 0,
      name: null,
      startDate: null,
      endDate: null
    },
  }),
  getters: {
    isSignedIn: (state) => (state.user.id > 0),
  },
  actions: {
    refresh(payload) {
      if (payload.accessToken && payload.refreshToken) {
        localStorage.tokenAccessToken = payload.accessToken;
        localStorage.tokenRefreshToken = payload.refreshToken;
        this.user.id = Number(localStorage.userId);
        this.user.name = localStorage.userName;
        this.user.email = localStorage.userEmail;
        this.user.isSuperAdmin = localStorage.userIsSuperAdmin;
        this.token.accessToken = localStorage.tokenAccessToken;
        this.token.refreshToken = localStorage.tokenRefreshToken;
        this.project.id = Number(localStorage.projectId);
        this.project.name = localStorage.projectName;
        this.project.displayName = localStorage.projectDisplayName;
        this.project.description = localStorage.projectDescription;
        this.sprint.id = Number(localStorage.sprintId);
        this.sprint.name = localStorage.sprintName;
        this.sprint.startDate = localStorage.sprintStartDate;
        this.sprint.endDate = localStorage.sprintEndDate;
      }
    },
    signIn(payload) {
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
      this.user = {
        id: Number(id),
        name,
        email,
        isSuperAdmin
      };
      this.token = {
        accessToken,
        refreshToken
      };
    },
    signOut() {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userIsSuperAdmin');
      localStorage.removeItem('tokenAccessToken');
      localStorage.removeItem('tokenRefreshToken');
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      this.user.id = 0;
      this.user.name = null;
      this.user.email = null;
      this.user.isSuperAdmin = null;
      this.token.accessToken = null;
      this.token.refreshToken = null;
      this.project.id = 0;
      this.project.name = null;
      this.project.displayName = null;
      this.breadcrumbs = [];
    },
    setProject(payload) {
      const {
        id,
        name,
        displayName,
        description
      } = payload;
      localStorage.projectId = id;
      localStorage.projectName = name;
      localStorage.projectDisplayName = displayName;
      localStorage.projectDescription = description;
      this.project = {
        id: Number(id),
        name,
        displayName,
        description
      };
    },
    setSprint(payload) {
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
      this.sprint = {
        id: Number(id),
        name,
        startDate,
        endDate
      };
    },
    clearProject() {
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      localStorage.removeItem('projectDescription');
      this.project.id = 0;
      this.project.name = null;
      this.project.displayName = null;
      this.project.description = null;
    },
    setRail(payload) {
      localStorage.rail = Boolean(payload);
      this.rail = Boolean(payload);
    },
    changeTheme(payload) {
      localStorage.theme = payload;
      localStorage.logoUrl = payload ? '/assets/images/logo-dark.png' : '/assets/images/logo.png';
      this.theme = payload;
      this.logoUrl = this.theme ? '/assets/images/logo-dark.png' : '/assets/images/logo.png';
    },
    setLanguage(payload) {
      localStorage.language = payload;
      this.language = payload;
    },
    pushBreadcrumbs(payload) {
      this.breadcrumbs.push(payload);
    },
    popBreadcrumbs() {
      this.breadcrumbs.slice(0, this.breadcrumbs.length - 1);
    },
    setBreadcrumbs(payload) {
      this.breadcrumbs = [...payload];
    },
    clearBreadcrumbs() {
      this.breadcrumbs = [];
    }
  },
})

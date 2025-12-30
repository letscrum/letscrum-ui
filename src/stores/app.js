// Utilities
import { defineStore } from 'pinia'
import Menu from '@/assets/core/menu.json';
import Link from '@/assets/core/link.json';
import Account from '@/assets/core/account.json';
import UserMenu from '@/assets/user/menu.json';

export const useAppStore = defineStore('app', {
  state: () => ({
    language: localStorage.language || window.navigator.language.toLowerCase() || 'en',
    rail: false,
    drawer: false,
    theme: null,
    logoUrl: '/images/logo-text.svg',
    menus: Menu,
    links: Link,
    accounts: Account,
    userMenus: UserMenu,
    globalErr: {
      show: false,
      message: null,
    },
    user: {
      id: null,
      name: null,
      email: null,
      isSuperAdmin: false
    },
    token: {
      accessToken: null,
      refreshToken: null
    },
    orgs: [],
    org: {
      id: null,
      name: null,
      displayName: null,
      description: null,
      myRole: null
    },
    project: {
      id: null,
      name: null,
      displayName: null,
      description: null,
      myRole: null
    },
    sprint: {
      id: null,
      name: null,
      startDate: null,
      endDate: null,
      burndownType: null,
      showDetails: false,
      showSprints: false,
    },
  }),
  getters: {
    isSignedIn: (state) => (state.user.id !== null),
  },
  actions: {
    refresh(payload) {
      if (payload.accessToken && payload.refreshToken) {
        localStorage.tokenAccessToken = payload.accessToken;
        localStorage.tokenRefreshToken = payload.refreshToken;
        this.user.id = localStorage.userId;
        this.user.name = localStorage.userName;
        this.user.email = localStorage.userEmail;
        this.user.isSuperAdmin = localStorage.userIsSuperAdmin === 'true';
        this.token.accessToken = localStorage.tokenAccessToken;
        this.token.refreshToken = localStorage.tokenRefreshToken;
        this.org.id = localStorage.orgId;
        this.org.name = localStorage.orgName;
        this.org.displayName = localStorage.orgDisplayName;
        this.org.description = localStorage.orgDescription;
        this.org.myRole = localStorage.orgMyRole;
        this.project.id = localStorage.projectId;
        this.project.name = localStorage.projectName;
        this.project.displayName = localStorage.projectDisplayName;
        this.project.description = localStorage.projectDescription;
        this.project.myRole = localStorage.projectMyRole;
        this.sprint.id = localStorage.sprintId;
        this.sprint.name = localStorage.sprintName;
        this.sprint.startDate = localStorage.sprintStartDate;
        this.sprint.endDate = localStorage.sprintEndDate;
        this.sprint.burndownType = localStorage.sprintBurndownType;
        this.sprint.showDetails = localStorage.sprintShowDetails;
        this.sprint.showSprints = localStorage.sprintShowSprints;
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
        id,
        name,
        email,
        isSuperAdmin
      };
      this.token = {
        accessToken,
        refreshToken
      };
    },
    updateUser(payload) {
      const { name, email } = payload;
      if (name) {
        localStorage.userName = name;
        this.user.name = name;
      }
      if (email) {
        localStorage.userEmail = email;
        this.user.email = email;
      }
    },
    signOut() {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userIsSuperAdmin');
      localStorage.removeItem('tokenAccessToken');
      localStorage.removeItem('tokenRefreshToken');
      localStorage.removeItem('orgs');
      localStorage.removeItem('orgId');
      localStorage.removeItem('orgName');
      localStorage.removeItem('orgDisplayName');
      localStorage.removeItem('orgDescription');
      localStorage.removeItem('orgMyRole');
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      localStorage.removeItem('projectDescription');
      localStorage.removeItem('projectMyRole');
      localStorage.removeItem('sprintId');
      localStorage.removeItem('sprintName');
      localStorage.removeItem('sprintStartDate');
      localStorage.removeItem('sprintEndDate');
      localStorage.removeItem('sprintShowDetails');
      localStorage.removeItem('sprintShowSprints');
      this.user.id = null;
      this.user.name = null;
      this.user.email = null;
      this.user.isSuperAdmin = null;
      this.token.accessToken = null;
      this.token.refreshToken = null;
      this.orgs = [];
      this.org.id = null;
      this.org.name = null;
      this.org.displayName = null;
      this.org.description = null;
      this.org.myRole = null;
      this.project.id = null;
      this.project.name = null;
      this.project.displayName = null;
      this.project.description = null;
      this.project.myRole = null;
      this.sprint.id = null;
      this.sprint.name = null;
      this.sprint.startDate = null;
      this.sprint.endDate = null;
      this.sprint.burndownType = null;
      this.sprint.showDetails = false;
      this.sprint.showSprints = false;
    },
    setOrgs(payload) {
      localStorage.orgs = JSON.stringify(payload);
      this.orgs = payload;
    },
    setOrg(payload) {
      const {
        id,
        name,
        displayName,
        description,
        myRole,
      } = payload;
      localStorage.orgId = id;
      localStorage.orgName = name;
      localStorage.orgDisplayName = displayName;
      localStorage.orgDescription = description;
      localStorage.orgMyRole = myRole;
      this.org = {
        id,
        name,
        displayName,
        description,
        myRole,
      };
    },
    setProject(payload) {
      const {
        id,
        name,
        displayName,
        description,
        myRole,
      } = payload;
      localStorage.projectId = id;
      localStorage.projectName = name;
      localStorage.projectDisplayName = displayName;
      localStorage.projectDescription = description;
      localStorage.projectMyRole = myRole;
      this.project = {
        id,
        name,
        displayName,
        description,
        myRole,
      };
    },
    setSprint(payload) {
      const {
        id,
        name,
        startDate,
        endDate,
        burndownType,
      } = payload;
      localStorage.sprintId = id;
      localStorage.sprintName = name;
      localStorage.sprintStartDate = startDate;
      localStorage.sprintEndDate = endDate;
      localStorage.sprintBurndownType = burndownType;
      this.sprint = {
        id,
        name,
        startDate,
        endDate,
        burndownType,
      };
    },
    setSidebar(payload) {
      if (payload == 'details') {
        localStorage.sprintShowDetails = true;
        localStorage.sprintShowSprints = false;
        this.sprint.showDetails = true;
        this.sprint.showSprints = false;
      } else if (payload == 'sprints') {
        localStorage.sprintShowDetails = false;
        localStorage.sprintShowSprints = true;
        this.sprint.showDetails = false;
        this.sprint.showSprints = true;
      } else {
        localStorage.sprintShowDetails = false;
        localStorage.sprintShowSprints = false;
        this.sprint.showDetails = false;
        this.sprint.showSprints = false;
      }
    },
    clearOrgs() {
      localStorage.removeItem('orgs');
      this.orgs = [];
    },
    clearOrg() {
      localStorage.removeItem('orgId');
      localStorage.removeItem('orgName');
      localStorage.removeItem('orgDisplayName');
      localStorage.removeItem('orgDescription');
      localStorage.removeItem('orgMyRole');
      this.org.id = null;
      this.org.name = null;
      this.org.displayName = null;
      this.org.description = null;
      this.org.myRole = null;
    },
    clearProject() {
      localStorage.removeItem('projectId');
      localStorage.removeItem('projectName');
      localStorage.removeItem('projectDisplayName');
      localStorage.removeItem('projectDescription');
      localStorage.removeItem('projectMyRole');
      this.project.id = null;
      this.project.name = null;
      this.project.displayName = null;
      this.project.description = null;
      this.project.myRole = null;
    },
    clearSprint() {
      localStorage.removeItem('sprintId');
      localStorage.removeItem('sprintName');
      localStorage.removeItem('sprintStartDate');
      localStorage.removeItem('sprintEndDate');
      localStorage.removeItem('sprintBurndownType');
      localStorage.removeItem('sprintShowDetails');
      localStorage.removeItem('sprintShowSprints');
      this.sprint.id = null;
      this.sprint.name = null;
      this.sprint.startDate = null;
      this.sprint.endDate = null;
      this.sprint.burndownType = null;
      this.sprint.showDetails = false;
      this.sprint.showSprints = false;
    },
    setRail(payload) {
      localStorage.rail = Boolean(payload);
      this.rail = Boolean(payload);
    },
    setDrawer(payload) {
      localStorage.drawer = Boolean(payload);
      this.drawer = Boolean(payload);
    },
    changeTheme(payload) {
      localStorage.theme = payload;
      this.theme = payload;
      if (payload == 'dark') {
        this.logoUrl = '/images/logo-text-dark.svg';
      } else {
        this.logoUrl = '/images/logo-text.svg';
      }
    },
    setLanguage(payload) {
      localStorage.language = payload;
      this.language = payload;
    },
    setGlobalErrMessage(payload) {
      this.globalErr.message = payload;
    },
    showGlobalErr(payload) {
      this.globalErr.show = payload;
    }
  },
})

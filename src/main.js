import '@/styles/global.css';

/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

import '@/plugins/axios'

import { useAppStore } from '@/stores/app'

const store = useAppStore()

const rail = localStorage.rail === 'true'
store.setRail(rail)
const drawer = localStorage.drawer === 'true'
store.setDrawer(drawer)

if (localStorage.tokenAccessToken && localStorage.tokenRefreshToken) {
  store.refresh ({
    accessToken: localStorage.tokenAccessToken,
    refreshToken: localStorage.tokenRefreshToken
  })
}

let currentTheme = localStorage.theme;

if (!currentTheme) {
  currentTheme = 'light'
  localStorage.theme = 'light'
}

store.changeTheme(currentTheme)

if (localStorage.sprintShowDetails == 'true') {
  store.setSidebar('details')
} else if (localStorage.sprintShowSprints == 'true') {
  store.setSidebar('sprints')
} else {
  store.setSidebar('')
}

if (localStorage.orgs) {
  store.orgs = JSON.parse(localStorage.orgs)
}

import axios from 'axios'

// read base url from .env file
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

axios.defaults.headers.Authorization = `Bearer ${store.token.accessToken}`

// if response status is 401, refresh token and retry request
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401 && store.token.refreshToken && store.token.refreshToken.length > 0) {
      const response = await axios.get('/v1/refresh/' + store.token.refreshToken)
      store.refresh({
        accessToken: response.data.item.accessToken,
        refreshToken: response.data.item.refreshToken
      })
      axios.defaults.headers.Authorization = `Bearer ${store.token.accessToken}`
      error.config.headers.Authorization = `Bearer ${store.token.accessToken}`
      return axios.request(error.config)
    } else {
      console.log('error', error)
      store.setGlobalErrMessage(error.response.data.message)
      store.showGlobalErr(true)
    }
    return Promise.reject(error)
  }
)

app.mount('#app')

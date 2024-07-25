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

import { useAppStore } from '@/stores/app'

const store = useAppStore()

const rail = localStorage.rail === 'true'
store.setRail(rail)

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

import axios from 'axios'

// read base url from .env file
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
console.log('process.env', import.meta.env.VITE_API_BASE_URL)

axios.defaults.headers.Authorization = `Bearer ${store.token.accessToken}`

app.mount('#app')

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

axios.defaults.baseURL = 'http://127.0.0.1:8081/api'
// axios.defaults.baseURL = 'https://imoogoo.com/api'
axios.defaults.headers.Authorization = `Bearer ${localStorage.tokenAccessToken}`

app.mount('#app')

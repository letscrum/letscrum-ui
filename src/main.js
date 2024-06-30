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

if (localStorage.tokenAccessToken && localStorage.tokenRefreshToken) {
  store.refresh ({
    accessToken: localStorage.tokenAccessToken,
    refreshToken: localStorage.tokenRefreshToken
  })
}

app.mount('#app')

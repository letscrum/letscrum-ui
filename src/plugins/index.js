/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import axios from 'axios'
import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  // const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {
    en: {
      hello: 'Hello, world!'
    },
    cn: {
    }
  }
  // locales.keys().forEach((key) => {
  //   const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  //   if (matched && matched.length > 1) {
  //     const locale = matched[1]
  //     messages[locale] = locales(key)
  //   }
  // });
  return messages
}

const i18n = createI18n({
  locale: localStorage.language || window.navigator.language.toLowerCase() || 'cn',
  fallbackLocale: 'cn',
  messages: loadLocaleMessages()
})

axios.defaults.baseURL = 'http://127.0.0.1:8081/api'
// axios.defaults.baseURL = 'https://imoogoo.com/api'
axios.defaults.headers.Authorization = `Bearer ${localStorage.tokenAccessToken}`

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(axios)
    .use(i18n)
}

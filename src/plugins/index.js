/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { createI18n } from 'vue-i18n'
import CN from '@/locales/cn.json';
import EN from '@/locales/en.json';

function loadLocaleMessages() {
  const messages = {
    cn: CN,
    en: EN,
  }
  return messages
}

const i18n = createI18n({
  locale: localStorage.language || window.navigator.language.toLowerCase() || 'cn',
  fallbackLocale: 'cn',
  messages: loadLocaleMessages()
})

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
}

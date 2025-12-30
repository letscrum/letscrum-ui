
import { createI18n } from 'vue-i18n'
import ZH from '@/locales/zh.json';
import EN from '@/locales/en.json';

function loadLocaleMessages() {
  const messages = {
    zh: ZH,
    en: EN,
  }
  return messages
}

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.language || window.navigator.language.toLowerCase() || 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages()
})

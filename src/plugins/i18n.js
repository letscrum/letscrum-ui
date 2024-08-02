
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
  locale: localStorage.language || window.navigator.language.toLowerCase() || 'zh',
  fallbackLocale: 'zh',
  messages: loadLocaleMessages()
})

/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Letscrum product palette
const letscrumLight = {
  dark: false,
  colors: {
    primary: '#0B6B63',
    'on-primary': '#FFFFFF',
    'brand-bar': '#0B5D57',
    'on-brand-bar': '#FFFFFF',
    secondary: '#52665A',
    accent: '#C13D63',
    info: '#3569A8',
    success: '#2D7D46',
    warning: '#B66A12',
    error: '#B93845',
    background: '#F4F6F3',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-variant': '#E9EEEA',
    'on-surface-variant': '#3E4943',
    'on-surface': '#1C2520',
    'on-background': '#1C2520',
    border: '#D7DED9',
    'border-strong': '#B7C2BA',
    'row-hover': '#EEF3EF',
    'row-selected': '#DCEDE8',
    'subtle-bg': '#F8FAF8',
    'header-bg': '#F1F5F2',
    'type-backlog': '#2E7185',
    'type-bug': '#B63B5D',
    'type-task': '#9A6B09',
    'type-feature': '#6B5C9A',
    'type-epic': '#B75C31'
  }
}

const letscrumDark = {
  dark: true,
  colors: {
    primary: '#55B8AA',
    'on-primary': '#092A26',
    'brand-bar': '#123B37',
    'on-brand-bar': '#F3FFFC',
    secondary: '#A7B5A9',
    accent: '#F08AAA',
    info: '#82AEE0',
    success: '#70C58C',
    warning: '#F2B55F',
    error: '#FF8491',
    background: '#171918',
    surface: '#212422',
    'surface-bright': '#292D2A',
    'surface-variant': '#303431',
    'on-surface-variant': '#D8DDDA',
    'on-surface': '#F3F4F2',
    'on-background': '#F3F4F2',
    border: '#3B403D',
    'border-strong': '#5B625E',
    'row-hover': '#2A2E2B',
    'row-selected': '#193F39',
    'subtle-bg': '#1C1F1D',
    'header-bg': '#1E211F',
    'type-backlog': '#66B8C8',
    'type-bug': '#F07D9D',
    'type-task': '#E4BA58',
    'type-feature': '#B6A6E3',
    'type-epic': '#E28B62'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: localStorage.theme || 'light',
    themes: {
      light: letscrumLight,
      dark: letscrumDark
    }
  },
  defaults: {
    VAppBar: {
      flat: true,
      density: 'default',
      height: 48
    },
    VBtn: {
      density: 'comfortable',
      rounded: 'sm',
      style: 'text-transform: none; letter-spacing: 0;'
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto',
      color: 'primary'
    },
    VTextarea: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto',
      menuProps: { offset: 6, contentClass: 'ado-dropdown-overlay' }
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto',
      menuProps: { offset: 6, contentClass: 'ado-dropdown-overlay' }
    },
    VCombobox: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto',
      menuProps: { offset: 6, contentClass: 'ado-dropdown-overlay' }
    },
    VMenu: {
      offset: 6,
      contentClass: 'ado-dropdown-overlay',
      transition: 'fade-transition'
    },
    VTable: {
      density: 'compact',
      hover: true
    },
    VDataTable: {
      density: 'compact',
      hover: true
    },
    VList: {
      density: 'compact'
    },
    VListItem: {
      density: 'compact',
      rounded: 0
    },
    VTab: {
      density: 'compact',
      style: 'text-transform: none; letter-spacing: 0;'
    },
    VChip: {
      density: 'compact',
      rounded: 'sm'
    },
    VBtnToggle: {
      density: 'compact',
      rounded: 'sm'
    },
    VCard: {
      elevation: 0,
      rounded: 'sm'
    },
    VCheckbox: {
      density: 'compact',
      hideDetails: 'auto'
    },
    VRadioGroup: {
      density: 'compact',
      hideDetails: 'auto'
    },
    VTooltip: {
      openDelay: 400
    }
  }
})

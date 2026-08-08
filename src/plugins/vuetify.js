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

// Azure DevOps inspired theme tokens
const adoLight = {
  dark: false,
  colors: {
    primary: '#0078D4',
    'on-primary': '#FFFFFF',
    secondary: '#005A9E',
    accent: '#106EBE',
    info: '#0078D4',
    success: '#107C10',
    warning: '#F2CB1D',
    error: '#D13438',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-variant': '#F3F2F1',
    'on-surface-variant': '#323130',
    'on-surface': '#201F1E',
    'on-background': '#201F1E',
    border: '#E1DFDD',
    'border-strong': '#C8C6C4',
    'row-hover': '#F3F2F1',
    'row-selected': '#DEECF9',
    'subtle-bg': '#FAFAFA',
    'header-bg': '#F8F8F8',
    'type-backlog': '#009CCC',
    'type-bug': '#CC293D',
    'type-task': '#F2CB1D',
    'type-feature': '#773B93',
    'type-epic': '#FF7B00'
  }
}

const adoDark = {
  dark: true,
  colors: {
    primary: '#2899F5',
    'on-primary': '#FFFFFF',
    secondary: '#479EF5',
    accent: '#479EF5',
    info: '#479EF5',
    success: '#13A10E',
    warning: '#FFC83D',
    error: '#F85149',
    background: '#201F1E',
    surface: '#252423',
    'surface-bright': '#2D2C2B',
    'surface-variant': '#323130',
    'on-surface-variant': '#F3F2F1',
    'on-surface': '#F3F2F1',
    'on-background': '#F3F2F1',
    border: '#3B3A39',
    'border-strong': '#605E5C',
    'row-hover': '#2D2C2B',
    'row-selected': '#1F3B57',
    'subtle-bg': '#1F1E1D',
    'header-bg': '#1B1A19',
    'type-backlog': '#3FB6E2',
    'type-bug': '#E15D70',
    'type-task': '#F2CB1D',
    'type-feature': '#A878C5',
    'type-epic': '#FF9933'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: localStorage.theme || 'light',
    themes: {
      light: adoLight,
      dark: adoDark
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
      menuProps: { offset: 4 }
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto'
    },
    VCombobox: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: 'auto'
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

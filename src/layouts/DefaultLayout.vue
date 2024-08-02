<template>
  <AppBar
    :menus="store.menus"
    :accounts="store.accounts"
    :user-menus="store.userMenus"
    :user="store.user"
    :logo-url="store.logoUrl" />
  <AppDrawer v-if="store.isSignedIn" :menus="store.menus" />
  <v-container fluid>
    <slot></slot>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()

</script>

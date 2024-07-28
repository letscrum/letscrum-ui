<template>
  <AppBar
    :menus="store.menus"
    :accounts="store.accounts"
    :userMenus="store.userMenus"
    :user="store.user"
    :logoUrl="store.logoUrl" />
  <AppDrawer :menus="store.menus" v-if="store.isSignedIn && route.name !== 'Orgs'" />
  <v-container fluid>
    <slot></slot>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'

const store = useAppStore()
const route = useRoute()

</script>

<template>
  <AppBar
    :menus="store.menus"
    :accounts="store.accounts"
    :userMenus="store.userMenus"
    :user="store.user"
    :logoUrl="store.logoUrl" />
  <AppDrawer :menus="store.menus" v-if="store.isSignedIn" />
  <v-container>
    <slot></slot>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()

</script>

<template>
    <AppBar
      :menus="appStore.menus"
      :accounts="appStore.accounts"
      :userMenus="appStore.userMenus"
      :user="appStore.user"
      :dark="appStore.theme"
      :language="appStore.language"
      :logoUrl="appStore.logoUrl" />
    <AppDrawer :menus="appStore.menus" />
    <v-container>
      <slot></slot>
    </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

</script>

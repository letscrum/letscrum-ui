<template>
  <AppBar />
  <AppDrawer v-if="store.isSignedIn" />
  <header v-if="$slots.subheader" class="ado-page-chrome">
    <slot name="subheader"></slot>
  </header>
  <main class="ado-page-content">
    <slot></slot>
  </main>
  <global-err-toast></global-err-toast>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>

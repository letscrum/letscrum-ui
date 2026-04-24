<template>
  <AppBar />
  <AppDrawer v-if="store.isSignedIn" />
  <!-- Optional sub-header (page title bar) -->
  <slot name="subheader"></slot>
  <div class="ado-page-content">
    <slot></slot>
  </div>
  <global-err-toast></global-err-toast>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script>

<style scoped>
.ado-page-content {
  padding: 0;
}
</style>

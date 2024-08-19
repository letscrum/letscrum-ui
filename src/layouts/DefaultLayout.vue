<template>
  <AppBar />
  <AppDrawer v-if="store.isSignedIn" />
  <v-container fluid>
    <slot></slot>
  </v-container>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()

</script>

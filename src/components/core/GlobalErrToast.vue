<template>
  <v-snackbar
    v-model="store.globalErr.show"
    timeout="3000"
    timer
    position="fixed"
    location="right"
  >
    {{
      store.globalErr.message
    }}
    <template #actions>
      <v-btn
        variant="text"
        @click="store.showGlobalErr(false)"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup>
import { useAppStore } from '@/stores/app'
const store = useAppStore()
</script>

<template>
  <v-snackbar
    v-model="store.globalErr.show"
    :timeout="6000"
    :color="store.globalErr.type"
    variant="elevated"
    location="bottom right"
    multi-line
    timer="white"
  >
    <div class="d-flex align-start" style="gap: 8px;">
      <v-icon size="small" class="mt-1">
        {{ store.globalErr.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
      </v-icon>
      <div>
        <div class="font-weight-bold">{{ store.globalErr.title }}</div>
        <div class="text-body-2">{{ store.globalErr.message || 'An unexpected error occurred.' }}</div>
      </div>
    </div>
    <template #actions>
      <v-btn
        aria-label="Dismiss notification"
        icon="mdi-close"
        variant="text"
        density="compact"
        size="small"
        @click="store.showGlobalErr(false)"
      />
    </template>
  </v-snackbar>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const store = useAppStore()
</script>

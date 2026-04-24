<template>
  <v-menu location="bottom end" offset="4">
    <template #activator="{ props }">
      <v-btn
        class="hidden-md-and-up"
        icon="mdi-dots-vertical"
        variant="text"
        density="comfortable"
        v-bind="props"
      />
    </template>
    <v-card class="ado-border" rounded="md" min-width="160">
      <v-list density="compact" nav class="pa-1">
        <v-list-item
          v-for="(account, i) in store.accounts"
          :key="i"
          :to="account.path"
          rounded="sm"
        >
          <v-list-item-title class="text-body-2">
            {{ $t('core.accounts.' + account.name + '.text') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const store = useAppStore()
</script>

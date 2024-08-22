<template>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn class="hidden-md-and-up" prepend-icon="mdi-dots-vertical" v-bind="props"></v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(account, i) in store.accounts" :key="i" :to="account.path">
        <v-list-item-title align="right">
          {{ $t('core.accounts.' + account.name + '.text') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const store = useAppStore()
</script>

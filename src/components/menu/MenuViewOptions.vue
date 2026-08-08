<template>
  <v-menu location="bottom end" offset="4">
    <template #activator="{ props }">
      <v-btn v-bind="props" aria-label="View options" icon="mdi-view-split-vertical" variant="text" size="small">
        <v-icon>mdi-view-split-vertical</v-icon>
        <v-tooltip activator="parent" location="bottom">View options</v-tooltip>
      </v-btn>
    </template>
    <v-card class="ado-border" rounded="md">
      <v-list density="compact" min-width="180">
        <v-list-subheader class="text-overline">Side panel</v-list-subheader>
        <v-list-item :active="store.sprint.showSprints" @click="onShowSide('sprints')">
          <template #prepend><v-icon size="small">mdi-format-list-bulleted</v-icon></template>
          <v-list-item-title>Sprints</v-list-item-title>
        </v-list-item>
        <v-list-item :disabled="!store.sprint.showSprints" @click="onShowSide('')">
          <template #prepend><v-icon size="small">mdi-eye-off-outline</v-icon></template>
          <v-list-item-title>Hide panel</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const emit = defineEmits(['afterShowSide'])

function onShowSide(type) {
  store.setSidebar(type)
  emit('afterShowSide', type)
}
</script>


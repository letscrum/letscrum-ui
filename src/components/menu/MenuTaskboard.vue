<template>
  <v-menu v-model="menuOpen" location="bottom end" offset="6">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-plus"
        append-icon="mdi-chevron-down"
        variant="tonal"
        color="primary"
        size="small"
        aria-label="Create work item"
      >
        New
      </v-btn>
    </template>
    <v-card class="ado-panel ado-work-item-menu" rounded="sm" min-width="240">
      <div class="px-3 pt-3 pb-2">
        <div class="text-subtitle-2 font-weight-semibold">Create work item</div>
        <div class="text-caption text-medium-emphasis">Choose the type of work to add.</div>
      </div>
      <v-divider />
      <v-list density="compact" class="pa-1">
        <v-list-item @click="onCreateWorkItem('Backlog')">
          <template #prepend>
            <v-avatar size="28" rounded="sm" color="surface-variant">
              <v-icon color="type-backlog" size="18">mdi-clipboard-text-outline</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>Backlog item</v-list-item-title>
          <v-list-item-subtitle>Plan product value</v-list-item-subtitle>
        </v-list-item>
        <v-list-item @click="onCreateWorkItem('Bug')">
          <template #prepend>
            <v-avatar size="28" rounded="sm" color="surface-variant">
              <v-icon color="type-bug" size="18">mdi-bug-outline</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title>Bug</v-list-item-title>
          <v-list-item-subtitle>Track a product defect</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['createWorkItem'])
const menuOpen = ref(false)

function onCreateWorkItem(type) {
  menuOpen.value = false
  emit('createWorkItem', type)
}
</script>

<style scoped>
.ado-work-item-menu :deep(.v-list-item) {
  min-height: 52px;
}
</style>

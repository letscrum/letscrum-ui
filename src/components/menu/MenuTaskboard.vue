<template>
  <v-menu location="bottom end" offset="4">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-plus"
        append-icon="mdi-chevron-down"
        variant="tonal"
        color="primary"
        size="small"
      >
        New
      </v-btn>
    </template>
    <v-card class="ado-border" rounded="md">
      <v-list density="compact" min-width="180">
        <v-list-item @click="onCreateWorkItem('Backlog')">
          <template #prepend><v-icon color="#009CCC" size="small">mdi-clipboard-text-outline</v-icon></template>
          <v-list-item-title>Backlog item</v-list-item-title>
        </v-list-item>
        <v-list-item @click="onCreateWorkItem('Bug')">
          <template #prepend><v-icon color="#CC293D" size="small">mdi-bug</v-icon></template>
          <v-list-item-title>Bug</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
const emit = defineEmits(['createWorkItem'])

function onCreateWorkItem(type) {
  emit('createWorkItem', type)
}
</script>

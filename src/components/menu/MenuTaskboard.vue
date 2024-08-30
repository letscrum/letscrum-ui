<template>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" variant="text" density="comfortable" style="margin-top: 6px;">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item @click="onCreateWorkItem('Bug')">
        <v-list-item-title>Bug</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onCreateWorkItem('Backlog')">
        <v-list-item-title>Backlog</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-spacer></v-spacer>
</template>

<script setup>
const emit = defineEmits(['createWorkItem'])

function onCreateWorkItem(type) {
  emit('createWorkItem', type)
}
</script>

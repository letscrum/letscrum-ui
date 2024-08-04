<template>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" variant="text">
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
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-order-bool-ascending" variant="text">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-subheader>用户中心</v-list-subheader>

      <v-list-item @click="onShow('details')">
        <v-list-item-title>Work details</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onShow('sprints')">
        <v-list-item-title>Sprints</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const emit = defineEmits(['createWorkItem', 'show'])

function onCreateWorkItem(type) {
  emit('createWorkItem', type)
}

function onShow(type) {
  emit('show', type)
}

</script>

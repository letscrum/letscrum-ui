<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-plus" variant="text" density="comfortable">
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
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-order-bool-ascending" variant="text" density="comfortable">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-subheader>用户中心</v-list-subheader>

      <v-list-item @click="workDetail = !workDetail">

        <v-list-item-title>Work details</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const emit = defineEmits(['createWorkItem'])

function onCreateWorkItem(type) {
  emit('createWorkItem', type)
}

</script>

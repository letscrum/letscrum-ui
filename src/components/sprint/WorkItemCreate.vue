<template>
  <v-dialog
    v-model="dialog"
    max-width="480"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenCreate()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon color="#009CCC" class="mr-2">mdi-clipboard-text-outline</v-icon>
          Create Work Item
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="workItem.title"
            label="Title"
            variant="outlined"
            density="compact"
            autofocus
            @keydown.enter="onCreateWorkItem()"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!workItem.title"
            @click="onCreateWorkItem()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { postCreateWorkItem } from '@/apis/workitem'
const emit = defineEmits(['afterCreate'])

import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const dialog = ref(false)
const workItem = ref({})

function onOpenCreate() {
  workItem.value = {}
  dialog.value = true
}

function onCreateWorkItem() {
  if (!workItem.value.title) return
  postCreateWorkItem({
    projectId: route.params.id,
    sprintId: route.params.sprintId,
    title: workItem.value.title,
  }).then(() => {
    dialog.value = false
    emit('afterCreate')
  })
}
</script>

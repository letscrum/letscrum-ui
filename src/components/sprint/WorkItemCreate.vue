<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenCreate()">
        <slot></slot>
      </div>
      <!-- <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenCreate()">
        Create
      </v-btn> -->
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-text-field v-model="workItem.title" label="Label"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="surface-variant"
            text="Create"
            variant="flat"
            @click="onCreateWorkItem()"
          ></v-btn>
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
  postCreateWorkItem({
    projectId: route.params.id,
    sprintId: route.params.sprintId,
  }).then(() => {
    dialog.value = false
    emit('afterCreate')
  })
}
</script>

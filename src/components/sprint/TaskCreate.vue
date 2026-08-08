<template>
  <v-dialog
    v-model="dialog"
    max-width="480"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpen()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon color="type-task" class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>
          Create Task
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="item.title"
            label="Task Title"
            variant="outlined"
            density="compact"
            autofocus
            @keydown.enter="onSave()"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!item.title"
            @click="onSave()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { postCreateTask } from '@/apis/task';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps({
  workItemId: {
    type: [String, Number],
    required: true
  }
});
const emit = defineEmits(['afterCreate'])

const item = ref({})
const dialog = ref(false)

function onOpen() {
  item.value = {}
}

function onSave() {
  if (!item.value.title) return
  let sprintId = "00000000-0000-0000-0000-000000000000"
  if (route.name === 'ProductBacklog') {
    sprintId = "00000000-0000-0000-0000-000000000000"
  } else {
    sprintId = route.params.sprintId
  }
  postCreateTask(
    route.params.orgId,
    route.params.projectId,
    props.workItemId, {
    sprintId: sprintId,
    title: item.value.title,
  }).then(res => {
    if (res.status === 200) {
      dialog.value = false
      emit('afterCreate')
    }
  })
}
</script>

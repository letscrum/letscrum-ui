<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpen()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-text class="px-4">
          <v-text-field v-model="item.title" label="Label"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        {{ item }}
        {{ props.workItemId }}

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="surface-variant"
            text="Save"
            variant="flat"
            @click="onSave()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { postCreateTask } from '@/apis/task';

import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps(['workItemId']);
const emit = defineEmits(['afterCreate'])

const item = ref({})
const dialog = ref(false)

function onOpen() {
  item.value = {}
}

function onSave() {
  postCreateTask(
    route.params.orgId,
    route.params.projectId,
    props.workItemId, {
    sprintId: route.params.sprintId,
    title: item.value.title,
  }).then(res => {
    if (res.status === 200) {
      dialog.value = false
      emit('afterCreate')
    }
  })
}

onMounted(() => {
})


</script>

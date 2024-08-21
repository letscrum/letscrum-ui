<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onLoadItem">
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
import { getGetTask } from '@/apis/task';
import { getGetWorkItem } from '@/apis/workitem';

import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps(['itemType', 'itemId']);

const item = ref({})
const dialog = ref(false)

function onSave() {
  console.log(item.value)
}

onMounted(() => {

})

function onLoadItem() {
  if (props.itemType === 'TASK') {
    getGetTask(
      route.params.orgId,
      route.params.projectId,
      '0',
      props.itemId).then((res) => {
      item.value = res.data.item
    })
  } else if (props.itemType === 'WORKITEM') {
    getGetWorkItem(
      route.params.orgId,
      route.params.projectId,
      props.itemId).then((res) => {
      item.value = res.data.item
    })
  }
}


</script>

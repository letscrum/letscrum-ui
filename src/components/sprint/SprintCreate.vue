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
          <v-text-field v-model="sprint.name" label="Label"></v-text-field>

          <v-date-picker v-model="dates" show-adjacent-months multiple="range"></v-date-picker>

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
            @click="onCreateSprint()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { postCreateSprint } from '@/apis/sprint'
const emit = defineEmits(['afterCreate'])

import { ref } from 'vue';

import { useRoute } from 'vue-router'

const route = useRoute()
const dialog = ref(false)
const sprint = ref({})
const dates = ref([])

function onOpenCreate() {
  sprint.value = {}
  dates.value = []
  dialog.value = true
}

function onCreateSprint() {
  console.log(dates.value)
  postCreateSprint(route.params.orgId, route.params.projectId, {
    name: sprint.value.name,
    startDate: Math.floor(new Date(dates.value[0] + 1000).getTime() / 1000),
    endDate: Math.floor(new Date(dates.value[dates.value.length - 1]).getTime() / 1000)
  }).then((res) => {
    console.log(res)
    if (res.status === 200) {
      console.log(res.data)
      dialog.value = false
      emit('afterCreate')
    }
  })
}
</script>

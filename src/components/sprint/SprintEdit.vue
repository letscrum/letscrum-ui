<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click.stop="onOpen()">
        <slot></slot>
      </div>
      <!-- <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenCreate()">
        Create
      </v-btn> -->
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-run-fast"
        title="Edit Sprint"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-text-field v-model="sprint.name" label="Sprint Name" variant="outlined" density="compact"></v-text-field>

          <v-select
            v-model="sprint.burndownType"
            :items="burndownTypes"
            label="Burndown Type"
            variant="outlined"
            density="compact"
          ></v-select>

          <div class="d-flex justify-center">
            <v-date-picker
              v-model="dates"
              show-adjacent-months
              multiple="range"
              title="Select Sprint Duration"
              header="Sprint Dates"
            ></v-date-picker>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Cancel"
            @click="isActive.value = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            text="Save"
            variant="flat"
            @click="onSaveSprint()"
            :disabled="!isValid"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { putUpdateSprint, getGetSprint } from '@/apis/sprint'
const emit = defineEmits(['afterEdit'])
const props = defineProps(['sprintId'])

import { ref, computed } from 'vue';

import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const route = useRoute()
const dialog = ref(false)
const sprint = ref({})
const dates = ref([])
const burndownTypes = ref([
  'ByTask',
  'ByHour'
])

const isValid = computed(() => {
  return sprint.value.name && sprint.value.burndownType && dates.value.length > 0
})

function onOpen() {
  getGetSprint(route.params.orgId, route.params.projectId, props.sprintId).then((res) => {
    if (res.status === 200) {
      console.log(res)
      sprint.value = res.data.item
      // generate dates start from startDate to endDate
      let start = new Date(sprint.value.startDate * 1000)
      let end = new Date(sprint.value.endDate * 1000)
      let date = new Date(start)
      let dateArr = []
      while (date <= end) {
        dateArr.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }
      dates.value = dateArr
      console.log(dates.value)
      dialog.value = true
    }
  })
}

function onSaveSprint() {
  // Sort dates to ensure start and end are correct
  const sortedDates = [...dates.value].sort((a, b) => new Date(a) - new Date(b))

  putUpdateSprint(route.params.orgId, route.params.projectId, sprint.value.id, {
    name: sprint.value.name,
    startDate: Math.floor(new Date(sortedDates[0]).getTime() / 1000),
    endDate: Math.floor(new Date(sortedDates[sortedDates.length - 1]).getTime() / 1000),
    burndownType: sprint.value.burndownType,
  }).then((res) => {
    console.log(res)
    if (res.status === 200) {
      console.log(res.data)
      // if store.sprint.id === sprint.id, update store.sprint
      if (store.sprint.id === sprint.value.id) {
        store.setSprint({
          id: sprint.value.id,
          name: sprint.value.name,
          startDate: Math.floor(new Date(sortedDates[0]).getTime() / 1000),
          endDate: Math.floor(new Date(sortedDates[sortedDates.length - 1]).getTime() / 1000),
          burndownType: sprint.value.burndownType,
        })
      }
      dialog.value = false
      emit('afterEdit')
    }
  })
}
</script>

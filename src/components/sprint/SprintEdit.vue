<template>
  <v-dialog
    v-model="dialog"
    max-width="560"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click.stop="onOpen()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-pencil-outline" class="mr-2" color="primary" />
          Edit Sprint
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="sprint.name"
            label="Sprint Name"
            variant="outlined"
            density="compact"
            class="mb-3"
          />

          <v-select
            v-model="sprint.burndownType"
            :items="burndownTypes"
            label="Burndown Type"
            variant="outlined"
            density="compact"
            class="mb-3"
          />

          <div class="d-flex justify-center">
            <v-date-picker
              v-model="dates"
              show-adjacent-months
              multiple="range"
              title="Select Sprint Duration"
              header="Sprint Dates"
            />
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :disabled="!isValid"
            @click="onSaveSprint()"
          >
            Save
          </v-btn>
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
const burndownTypes = ref(['ByTask', 'ByHour'])

const isValid = computed(() => {
  return sprint.value.name && sprint.value.burndownType && dates.value.length > 0
})

function onOpen() {
  getGetSprint(route.params.orgId, route.params.projectId, props.sprintId).then((res) => {
    if (res.status === 200) {
      sprint.value = res.data.item
      let start = new Date(sprint.value.startDate * 1000)
      let end = new Date(sprint.value.endDate * 1000)
      let date = new Date(start)
      let dateArr = []
      while (date <= end) {
        dateArr.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }
      dates.value = dateArr
      dialog.value = true
    }
  })
}

function onSaveSprint() {
  const sortedDates = [...dates.value].sort((a, b) => new Date(a) - new Date(b))
  putUpdateSprint(route.params.orgId, route.params.projectId, sprint.value.id, {
    name: sprint.value.name,
    startDate: Math.floor(new Date(sortedDates[0]).getTime() / 1000),
    endDate: Math.floor(new Date(sortedDates[sortedDates.length - 1]).getTime() / 1000),
    burndownType: sprint.value.burndownType,
  }).then((res) => {
    if (res.status === 200) {
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

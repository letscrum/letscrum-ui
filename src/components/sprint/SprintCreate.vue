<template>
  <v-dialog
    v-model="dialog"
    max-width="560"
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
          <v-icon icon="mdi-run-fast" class="mr-2" color="primary" />
          Create Sprint
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="sprint.name"
            label="Sprint Name"
            variant="outlined"
            density="compact"
            class="mb-3"
            autofocus
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
            @click="onCreateSprint()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { postCreateSprint } from '@/apis/sprint'
const emit = defineEmits(['afterCreate'])

import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const dialog = ref(false)
const sprint = ref({})
const dates = ref([])
const burndownTypes = ref(['ByTask', 'ByHour'])

const isValid = computed(() => {
  return sprint.value.name && sprint.value.burndownType && dates.value.length > 0
})

function onOpenCreate() {
  sprint.value = { burndownType: 'ByTask' }
  dates.value = []
  dialog.value = true
}

function onCreateSprint() {
  const sortedDates = [...dates.value].sort((a, b) => new Date(a) - new Date(b))
  postCreateSprint(route.params.orgId, route.params.projectId, {
    name: sprint.value.name,
    startDate: Math.floor(new Date(sortedDates[0]).getTime() / 1000),
    endDate: Math.floor(new Date(sortedDates[sortedDates.length - 1]).getTime() / 1000),
    burndownType: sprint.value.burndownType
  }).then((res) => {
    if (res.status === 200) {
      dialog.value = false
      emit('afterCreate')
    }
  })
}
</script>

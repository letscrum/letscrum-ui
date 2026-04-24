<template>
  <v-card flat class="ado-border h-100 d-flex flex-column" rounded="0">
    <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b">
      <v-icon size="small" color="primary" class="mr-2">mdi-run-fast</v-icon>
      <span class="text-subtitle-2 font-weight-bold">Sprints</span>
      <v-chip v-if="props.sprints && props.sprints.length" size="x-small" variant="tonal" class="ml-2">
        {{ props.sprints.length }}
      </v-chip>
      <v-spacer />
      <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="onCloseSide" />
    </div>
    <div class="flex-grow-1 overflow-y-auto pa-1">
      <VueDraggable
        id="00000000-0000-0000-0000-000000000000"
        v-model="sprintWorkItems"
        group="workItem"
        style="width: 100%;"
        draggable="false"
        @add="onMoveToSprint"
      >
        <v-list-item
          :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/backlog'"
          density="compact"
          class="ado-sprint-row"
          :active="route.name === 'ProductBacklog'"
        >
          <template #prepend>
            <v-icon size="small">mdi-format-list-bulleted</v-icon>
          </template>
          <v-list-item-title class="text-body-2">Product Backlog</v-list-item-title>
        </v-list-item>
      </VueDraggable>

      <v-divider class="my-1" />

      <div v-if="props.sprints && props.sprints.length === 0" class="d-flex flex-column align-center justify-center text-medium-emphasis py-8 px-3 text-center">
        <v-icon size="40" class="text-medium-emphasis mb-2">mdi-run-fast</v-icon>
        <div class="text-body-2 font-weight-medium">No sprints yet</div>
        <div class="text-caption">Create a sprint to start moving work items into iterations.</div>
      </div>

      <div v-for="item in props.sprints" :key="item.id">
        <VueDraggable
          :id="item.id"
          v-model="sprintWorkItems"
          group="workItem"
          style="width: 100%;"
          draggable="false"
          :disabled="item.id === route.params.sprintId"
          @add="onMoveToSprint"
        >
          <v-list-item
            lines="two"
            :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
            :active="item.id === route.params.sprintId"
            density="compact"
            class="ado-sprint-row"
            :class="{ 'ado-sprint-row--current': item.status === 'Current' }"
            @click="onSetSprint(item.id, item.name, item.startDate, item.endDate, item.burndownType)"
          >
            <template #prepend>
              <v-icon size="small" :color="item.status === 'Current' ? 'primary' : 'grey'">mdi-run-fast</v-icon>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ formatDate(item.startDate) }} – {{ formatDate(item.endDate) }}
            </v-list-item-subtitle>
            <template #append>
              <v-chip
                size="x-small"
                variant="tonal"
                :color="item.status === 'Current' ? 'primary' : (item.status === 'Future' ? 'success' : undefined)"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-list-item>
        </VueDraggable>
      </div>
    </div>
    <div class="ado-border-t px-3 py-2 d-flex align-center text-caption text-medium-emphasis" style="gap: 6px;">
      <v-icon size="x-small">mdi-cursor-move</v-icon>
      Drag a work item onto a sprint to move it.
    </div>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { putMoveWorkItem } from '@/apis/workitem';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const props = defineProps(['sprints'])
const store = useAppStore()
const route = useRoute()
const emit = defineEmits(['after-move', 'close-side'])
const sprintWorkItems = ref([])

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(Number(ts) * 1000)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function onMoveToSprint(item) {
  if ((props.sprints.find((sprint) => sprint.id == item.to.id) && item.item.id != item.to.id && route.params.sprintId != item.to.id)
    || item.to.id == '00000000-0000-0000-0000-000000000000') {
    putMoveWorkItem(store.org.id, route.params.projectId, item.item.id, {
      sprintId: item.to.id,
    }).then(() => {
      emit('after-move')
    })
  } else if (item.item.id == item.to.id) {
    return
  } else {
    emit('after-move')
  }
}

function onSetSprint(id, name, startDate, endDate, burndownType) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate,
    burndownType: burndownType,
  })
  emit('after-move')
}

function onCloseSide() {
  emit('close-side')
}
</script>

<style scoped>
.ado-sprint-row {
  border-radius: 4px;
  margin: 2px 0;
}
.ado-sprint-row--current {
  border-left: 3px solid rgb(var(--v-theme-primary));
}
</style>

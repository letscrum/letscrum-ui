<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 2 : 0"
      class="ado-border cursor-pointer h-100 d-flex flex-column"
      rounded="md"
      :style="`border-left: 3px solid ${statusColor};`"
      @click="onEnter"
    >
      <div class="d-flex align-start pa-3" style="gap: 10px;">
        <v-icon :color="statusColor" size="20" class="mt-1">mdi-run-fast</v-icon>
        <div style="min-width: 0;" class="flex-grow-1">
          <div class="text-body-1 font-weight-bold text-truncate">{{ sprint.name }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ formatDate(sprint.startDate) }} – {{ formatDate(sprint.endDate) }}
          </div>
        </div>
        <v-chip
          size="x-small"
          variant="tonal"
          :color="statusChipColor"
        >
          {{ sprint.status }}
        </v-chip>
      </div>

      <v-divider />
      <div class="d-flex align-center px-2 py-1">
        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          density="comfortable"
          append-icon="mdi-arrow-right"
          @click.stop="onEnter"
        >
          {{ $t('project.detail.sprints.enter') }}
        </v-btn>
        <v-spacer />
        <SprintEdit :sprint-id="sprint.id" @after-edit="$emit('refresh')">
          <v-btn icon="mdi-pencil-outline" size="small" variant="text" density="comfortable">
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="bottom">Edit sprint</v-tooltip>
          </v-btn>
        </SprintEdit>
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          density="comfortable"
          @click.stop="$emit('delete', sprint.id)"
        >
          <v-icon>mdi-delete-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">Delete sprint</v-tooltip>
        </v-btn>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['sprint']);
const emit = defineEmits(['enter', 'delete', 'refresh']);

const statusColor = computed(() => {
  switch (props.sprint?.status) {
    case 'Current': return '#0078D4'
    case 'Past': return '#8A8886'
    case 'Future': return '#107C10'
    default: return '#C8C6C4'
  }
})
const statusChipColor = computed(() => {
  switch (props.sprint?.status) {
    case 'Current': return 'primary'
    case 'Past': return 'grey'
    case 'Future': return 'success'
    default: return undefined
  }
})

function formatDate(ts) {
  if (!ts) return '—'
  const d = new Date(Number(ts) * 1000)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function onEnter() {
  emit('enter', props.sprint);
}
</script>

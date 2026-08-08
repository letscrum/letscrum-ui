<template>
  <v-hover v-slot="{ props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="ado-panel ado-sprint-card cursor-pointer d-flex flex-column"
      rounded="sm"
      :style="{ '--ado-sprint-accent': statusColor }"
      role="link"
      tabindex="0"
      :aria-label="`Open sprint ${sprint.name}`"
      @click="onEnter"
      @keydown.enter.prevent="onEnter"
      @keydown.space.prevent="onEnter"
    >
      <div class="ado-sprint-card__body d-flex align-start">
        <div class="ado-sprint-card__icon d-flex align-center justify-center">
          <v-icon :style="{ color: statusColor }" size="20">mdi-run-fast</v-icon>
        </div>
        <div class="ado-sprint-card__content flex-grow-1">
          <div class="ado-sprint-card__title text-truncate">{{ sprint.name }}</div>
          <div class="ado-sprint-card__date text-medium-emphasis">
            <v-icon size="14" class="mr-1">mdi-calendar-range</v-icon>
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

      <div class="ado-sprint-card__footer d-flex align-center">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          append-icon="mdi-arrow-right"
          @click.stop="onEnter"
        >
          {{ $t('project.detail.sprints.enter') }}
        </v-btn>
        <v-spacer />
        <div class="ado-sprint-card__actions d-flex align-center">
        <SprintEdit :sprint-id="sprint.id" @after-edit="$emit('refresh')">
          <v-btn aria-label="Edit sprint" icon="mdi-pencil-outline" size="small" variant="text">
            <v-icon>mdi-pencil-outline</v-icon>
            <v-tooltip activator="parent" location="bottom">Edit sprint</v-tooltip>
          </v-btn>
        </SprintEdit>
        <v-btn
          icon="mdi-delete-outline"
          aria-label="Delete sprint"
          size="small"
          variant="text"
          color="error"
          @click.stop="deleteDialog = true"
        >
          <v-icon>mdi-delete-outline</v-icon>
          <v-tooltip activator="parent" location="bottom">Delete sprint</v-tooltip>
        </v-btn>
        <v-dialog v-model="deleteDialog" max-width="420">
          <v-card class="ado-panel" @click.stop>
            <div class="ado-dialog-header d-flex align-center px-4 py-3 ado-border-b">
              <v-icon color="error" class="mr-2">mdi-alert-outline</v-icon>
              <span class="text-subtitle-1 font-weight-semibold">Delete sprint?</span>
              <v-spacer />
              <v-btn aria-label="Close delete confirmation" icon="mdi-close" variant="text" size="small" @click="deleteDialog = false" />
            </div>
            <v-card-text class="pa-4 text-body-2">
              <strong>{{ sprint.name }}</strong> will be permanently deleted. This action cannot be undone.
            </v-card-text>
            <v-card-actions class="px-4 pb-4 pt-0">
              <v-spacer />
              <v-btn variant="text" size="small" @click="deleteDialog = false">Cancel</v-btn>
              <v-btn color="error" variant="flat" size="small" @click="confirmDelete">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  sprint: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['enter', 'delete', 'refresh']);
const deleteDialog = ref(false)

const statusColor = computed(() => {
  switch (props.sprint?.status) {
    case 'Current': return 'rgb(var(--v-theme-primary))'
    case 'Past': return 'var(--ado-text-tertiary)'
    case 'Future': return 'rgb(var(--v-theme-success))'
    default: return 'var(--ado-border-strong)'
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

function confirmDelete() {
  emit('delete', props.sprint.id)
  deleteDialog.value = false
}
</script>

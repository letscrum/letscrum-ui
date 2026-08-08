<template>
  <v-dialog
    v-model="dialog"
    max-width="900"
    scrollable
  >
    <template #activator="{ props: activatorProps }">
      <div
        v-bind="activatorProps"
        class="ado-item-detail-trigger text-truncate"
        role="button"
        tabindex="0"
        @click="onLoadItem"
        @keydown.enter.prevent="onLoadItem"
        @keydown.space.prevent="onLoadItem"
      >
        <slot></slot>
      </div>
    </template>

    <v-card class="ado-panel" rounded="sm">
      <!-- Header with type color bar -->
      <div :style="`height: 4px; background: ${typeColor};`"></div>

      <v-toolbar density="compact" flat color="surface" class="px-2">
        <v-icon :color="typeColor" class="mr-2">{{ typeIcon }}</v-icon>
        <span class="text-caption text-medium-emphasis mr-2">{{ typeLabel }} #{{ item.id }}</span>
        <v-chip v-if="item.status" size="x-small" variant="tonal" :color="statusColor">
          <v-icon start size="x-small">mdi-circle</v-icon>{{ item.status }}
        </v-chip>
        <v-spacer />
        <v-btn aria-label="Close item details" icon="mdi-close" variant="text" density="compact" @click="dialog = false" />
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-0" style="max-height: 70vh;">
        <v-skeleton-loader v-if="loading" type="article, sentences, article" class="pa-4" />
        <v-row no-gutters>
          <!-- Main column -->
          <v-col v-if="!loading" cols="12" md="8" class="pa-4">
            <v-text-field
              v-model="item.title"
              label="Title"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="mb-4"
            />

            <div class="text-overline text-medium-emphasis mb-2">Description</div>
            <v-textarea
              v-model="item.description"
              placeholder="Add a description..."
              variant="outlined"
              rows="4"
              auto-grow
              hide-details="auto"
              class="mb-4"
            />

            <div class="text-overline text-medium-emphasis mb-2">Acceptance criteria</div>
            <v-textarea
              v-model="item.acceptanceCriteria"
              placeholder="Define acceptance criteria..."
              variant="outlined"
              rows="3"
              auto-grow
              hide-details="auto"
              class="mb-4"
            />

            <v-alert
              v-if="saveError"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-2"
            >
              {{ saveError }}
            </v-alert>
          </v-col>

          <v-divider vertical class="d-none d-md-flex" />

          <!-- Side column: Details -->
          <v-col v-if="!loading" cols="12" md="4" class="pa-4 ado-subtle">
            <div class="text-overline text-medium-emphasis mb-2">Details</div>

            <div class="ado-detail-row">
              <span class="ado-detail-label">Assigned to</span>
              <span class="ado-detail-value">{{ item.assignUser?.name || 'Unassigned' }}</span>
            </div>
            <div class="ado-detail-row">
              <span class="ado-detail-label">State</span>
              <span class="ado-detail-value">{{ item.status || '—' }}</span>
            </div>
            <div class="ado-detail-row">
              <span class="ado-detail-label">Type</span>
              <span class="ado-detail-value">{{ typeLabel }}</span>
            </div>
            <div v-if="item.priority" class="ado-detail-row">
              <span class="ado-detail-label">Priority</span>
              <span class="ado-detail-value">{{ item.priority }}</span>
            </div>
            <div v-if="item.remainingWork !== undefined" class="ado-detail-row">
              <span class="ado-detail-label">Remaining</span>
              <span class="ado-detail-value">{{ item.remainingWork }}h</span>
            </div>

            <v-divider class="my-3" />
            <div class="text-overline text-medium-emphasis mb-2">Classification</div>
            <div class="ado-detail-row">
              <span class="ado-detail-label">Project</span>
              <span class="ado-detail-value">{{ store.project.name || '—' }}</span>
            </div>
            <div class="ado-detail-row">
              <span class="ado-detail-label">Sprint</span>
              <span class="ado-detail-value">{{ store.sprint.name || '—' }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      <v-card-actions class="px-3 py-2">
        <v-btn variant="text" :disabled="saving" @click="dialog = false">Cancel</v-btn>
        <v-spacer />
        <v-btn
          variant="flat"
          color="primary"
          :loading="saving"
          :disabled="loading || !item.title?.trim()"
          @click="onSave"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getGetTask, putUpdateTask } from '@/apis/task';
import { getGetWorkItem, putUpdateWorkItem } from '@/apis/workitem';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

const props = defineProps({
  itemType: {
    type: String,
    required: true
  },
  itemId: {
    type: [String, Number],
    required: true
  }
});
const emit = defineEmits(['afterUpdate'])

const item = ref({})
const dialog = ref(false)
const loading = ref(false)
const saving = ref(false)
const saveError = ref('')

const typeIcon = computed(() => {
  if (props.itemType === 'TASK') return 'mdi-checkbox-marked-circle-outline'
  if (item.value.type === 'Bug') return 'mdi-bug'
  return 'mdi-clipboard-text-outline'
})
const typeColor = computed(() => {
  if (props.itemType === 'TASK') return 'rgb(var(--v-theme-type-task))'
  if (item.value.type === 'Bug') return 'rgb(var(--v-theme-type-bug))'
  return 'rgb(var(--v-theme-type-backlog))'
})
const typeLabel = computed(() => {
  if (props.itemType === 'TASK') return 'Task'
  return item.value.type || 'Backlog'
})
const statusColor = computed(() => {
  switch (item.value.status) {
    case 'Done': return 'success'
    case 'In Progress':
    case 'InProgress':
    case 'Approved': return 'primary'
    default: return 'grey'
  }
})

async function onSave() {
  saving.value = true
  saveError.value = ''
  const payload = {
    title: item.value.title,
    description: item.value.description || '',
    acceptanceCriteria: item.value.acceptanceCriteria || ''
  }

  try {
    if (props.itemType === 'TASK') {
      await putUpdateTask(
        route.params.orgId,
        route.params.projectId,
        item.value.workItemId,
        props.itemId,
        payload
      )
    } else {
      await putUpdateWorkItem(
        route.params.orgId,
        route.params.projectId,
        props.itemId,
        payload
      )
    }
    emit('afterUpdate', item.value)
    dialog.value = false
  } catch (error) {
    saveError.value = error.response?.data?.message || 'Unable to save this item. Try again.'
  } finally {
    saving.value = false
  }
}

async function onLoadItem() {
  loading.value = true
  saveError.value = ''
  if (props.itemType === 'TASK') {
    try {
      const res = await getGetTask(
        route.params.orgId,
        route.params.projectId,
        '0',
        props.itemId)
      item.value = res.data.item
    } finally {
      loading.value = false
    }
  } else if (props.itemType === 'WORKITEM') {
    try {
      const res = await getGetWorkItem(
        route.params.orgId,
        route.params.projectId,
        props.itemId)
      item.value = res.data.item
    } finally {
      loading.value = false
    }
  }
}

</script>

<style scoped>
.ado-item-detail-trigger:focus-visible {
  border-radius: 2px;
  outline: 2px solid var(--ado-focus);
  outline-offset: 2px;
}
.ado-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px dashed var(--ado-border);
}
.ado-detail-row:last-child {
  border-bottom: none;
}
.ado-detail-label {
  color: var(--ado-text-secondary);
  font-size: 12px;
}
.ado-detail-value {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

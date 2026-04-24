<template>
  <v-dialog
    v-model="dialog"
    max-width="900"
    scrollable
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" class="text-truncate" @click="onLoadItem">
        <slot></slot>
      </div>
    </template>

    <v-card class="ado-border" rounded="md">
      <!-- Header with type color bar -->
      <div :style="`height: 4px; background: ${typeColor};`"></div>

      <v-toolbar density="compact" flat color="surface" class="px-2">
        <v-icon :color="typeColor" class="mr-2">{{ typeIcon }}</v-icon>
        <span class="text-caption text-medium-emphasis mr-2">{{ typeLabel }} #{{ item.id }}</span>
        <v-chip v-if="item.status" size="x-small" variant="tonal" :color="statusColor">
          <v-icon start size="x-small">mdi-circle</v-icon>{{ item.status }}
        </v-chip>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" density="compact" @click="dialog = false" />
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-0" style="max-height: 70vh;">
        <v-row no-gutters>
          <!-- Main column -->
          <v-col cols="12" md="8" class="pa-4">
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

            <v-tabs v-model="activeTab" density="compact" color="primary">
              <v-tab value="discussion"><v-icon size="small" class="mr-1">mdi-comment-text-outline</v-icon>Discussion</v-tab>
              <v-tab value="history"><v-icon size="small" class="mr-1">mdi-history</v-icon>History</v-tab>
              <v-tab value="links"><v-icon size="small" class="mr-1">mdi-link-variant</v-icon>Links</v-tab>
              <v-tab value="attachments"><v-icon size="small" class="mr-1">mdi-paperclip</v-icon>Attachments</v-tab>
            </v-tabs>
            <v-divider />
            <v-window v-model="activeTab" class="mt-3">
              <v-window-item value="discussion">
                <div class="text-body-2 text-medium-emphasis text-center py-6">
                  <v-icon size="32" class="mb-2">mdi-comment-outline</v-icon>
                  <div>No comments yet.</div>
                </div>
              </v-window-item>
              <v-window-item value="history">
                <div class="text-body-2 text-medium-emphasis text-center py-6">
                  <v-icon size="32" class="mb-2">mdi-history</v-icon>
                  <div>No history available.</div>
                </div>
              </v-window-item>
              <v-window-item value="links">
                <div class="text-body-2 text-medium-emphasis text-center py-6">
                  <v-icon size="32" class="mb-2">mdi-link-variant-off</v-icon>
                  <div>No linked items.</div>
                </div>
              </v-window-item>
              <v-window-item value="attachments">
                <div class="text-body-2 text-medium-emphasis text-center py-6">
                  <v-icon size="32" class="mb-2">mdi-paperclip</v-icon>
                  <div>No attachments.</div>
                </div>
              </v-window-item>
            </v-window>
          </v-col>

          <v-divider vertical class="d-none d-md-flex" />

          <!-- Side column: Details -->
          <v-col cols="12" md="4" class="pa-4 ado-subtle">
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
        <v-btn variant="text" @click="dialog = false">Close</v-btn>
        <v-spacer />
        <v-btn variant="flat" color="primary" @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getGetTask } from '@/apis/task';
import { getGetWorkItem } from '@/apis/workitem';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

const props = defineProps(['itemType', 'itemId']);
const emit = defineEmits(['afterUpdate'])

const item = ref({})
const dialog = ref(false)
const activeTab = ref('discussion')

const typeIcon = computed(() => {
  if (props.itemType === 'TASK') return 'mdi-checkbox-marked-circle-outline'
  if (item.value.type === 'Bug') return 'mdi-bug'
  return 'mdi-clipboard-text-outline'
})
const typeColor = computed(() => {
  if (props.itemType === 'TASK') return '#F2CB1D'
  if (item.value.type === 'Bug') return '#CC293D'
  return '#009CCC'
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

function onSave() {
  emit('afterUpdate')
  dialog.value = false
}

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

<style scoped>
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

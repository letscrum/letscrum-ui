<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-avatar
          size="32"
          rounded="md"
          :color="uuidToColor(project.id || '')"
          class="mr-3"
        >
          <span class="text-caption font-weight-bold text-white">
            {{ (project.displayName || project.name || '?').substring(0, 1).toUpperCase() }}
          </span>
        </v-avatar>
        <div class="d-flex flex-column" style="line-height: 1.2; min-width: 0;">
          <span class="ado-subheader__title text-truncate">
            {{ project.displayName || project.name || 'Project' }}
          </span>
          <span class="text-caption text-medium-emphasis text-truncate">
            {{ project.name }}
          </span>
        </div>
        <v-spacer />
        <div class="ado-toolbar-actions ado-entity-actions">
          <ProjectEdit @after-update="onGetProject">
            <v-btn variant="text" size="small" prepend-icon="mdi-pencil-outline">
              {{ $t('project.detail.edit') }}
            </v-btn>
          </ProjectEdit>
          <ProjectDelete>
            <v-btn variant="text" size="small" color="error" prepend-icon="mdi-delete-outline">
              {{ $t('project.detail.delete') }}
            </v-btn>
          </ProjectDelete>
        </div>
      </div>

      <div class="ado-subheader ado-tabs-bar">
        <v-tabs v-model="tab" height="40" color="primary" density="compact">
          <v-tab value="sprints">
            <template #prepend><v-icon size="small">mdi-run-fast</v-icon></template>
            {{ $t('project.detail.tabs.sprints') }}
          </v-tab>
          <v-tab value="members">
            <template #prepend><v-icon size="small">mdi-account-group-outline</v-icon></template>
            {{ $t('project.detail.tabs.members') }}
          </v-tab>
        </v-tabs>
      </div>
    </template>

    <div class="ado-page">
      <p v-if="project.description" class="text-body-2 text-medium-emphasis mb-3">
        {{ project.description }}
      </p>

      <v-window v-model="tab" style="overflow: visible;">
        <!-- Sprints Tab -->
        <v-window-item value="sprints" style="overflow: visible;">
          <div class="ado-section-toolbar">
            <span class="text-overline text-medium-emphasis">{{ sprints.length }} sprint{{ sprints.length === 1 ? '' : 's' }}</span>
            <v-spacer />
            <SprintCreate @after-create="LoadSprints()">
              <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" size="small">
                {{ $t('project.detail.sprints.create') }}
              </v-btn>
            </SprintCreate>
          </div>

          <div v-if="sprintsLoading" class="ado-sprint-grid">
            <v-skeleton-loader v-for="item in 3" :key="item" class="ado-panel" width="320" type="article" />
          </div>

          <div v-else-if="!sprintsReady" class="ado-loading-reserved" aria-hidden="true"></div>

          <div v-else-if="sprints.length > 0" class="ado-sprint-grid">
            <div v-for="sprint in sprints" :key="sprint.id" class="ado-sprint-grid__item">
              <SprintCard
                :sprint="sprint"
                @enter="(s) => onSetSprint(s.id, s.name, s.startDate, s.endDate, s.burndownType)"
                @refresh="LoadSprints"
                @delete="(id) => onDeleteSprint(sprint.projectId, id)"
              />
            </div>
          </div>

          <div v-else class="ado-empty-state d-flex flex-column align-center justify-center">
            <v-icon size="48" class="text-medium-emphasis">mdi-run-fast</v-icon>
            <h3 class="text-subtitle-1 font-weight-medium mt-3">{{ $t('project.detail.sprints.empty') }}</h3>
            <SprintCreate @after-create="LoadSprints()">
              <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" size="small" class="mt-3">
                {{ $t('project.detail.sprints.create') }}
              </v-btn>
            </SprintCreate>
          </div>
        </v-window-item>

        <!-- Members Tab -->
        <v-window-item value="members">
          <v-card class="ado-panel">
            <div class="ado-panel-toolbar ado-header-bg ado-border-b">
              <v-icon size="small" color="primary">mdi-account-group-outline</v-icon>
              <span class="text-subtitle-2 font-weight-bold">{{ $t('project.detail.tabs.members') }}</span>
              <v-chip size="x-small" variant="tonal">{{ allMembers.length }}</v-chip>
              <v-spacer />
              <v-text-field
                v-model="search"
                density="compact"
                :placeholder="$t('user.list.search')"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
                clearable
                class="ado-toolbar-search"
              />
              <v-btn aria-label="Refresh members" icon="mdi-refresh" variant="text" size="small" @click="onGetProject" />
            </div>

            <v-data-table
              :headers="headers"
              :items="allMembers"
              :loading="membersLoading"
              :search="search"
              hover
              density="compact"
            >
              <template #loading>
                <div class="ado-table-state">
                  <v-progress-circular indeterminate color="primary" size="24" width="2" />
                  <span>Loading project members...</span>
                </div>
              </template>

              <template #no-data>
                <div v-if="membersReady" class="ado-table-state">
                  <v-icon size="36" class="text-medium-emphasis">mdi-account-group-outline</v-icon>
                  <span>{{ search ? 'No members match your search.' : 'No project members yet.' }}</span>
                </div>
              </template>

              <template #[`item.avatar`]="{ item }">
                <UserAvatar :user-id="item.userId" :user-name="item.userName" size="28" />
              </template>

              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="item.userName == project.createdUser?.name ? 'warning' : (item.isAdmin ? 'primary' : undefined)"
                  size="x-small"
                  variant="tonal"
                >
                  {{ item.userName == project.createdUser?.name ? $t('project.detail.members.owner') : (item.isAdmin ? $t('project.detail.members.admin') : $t('project.detail.members.member')) }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <div v-if="item.userName != project.createdUser?.name" class="d-flex align-center justify-end" style="gap: 4px;">
                  <SetProjectAdmin :member="item" @after="onGetProject">
                    <v-btn
                      size="small"
                      variant="text"
                      :color="item.isAdmin ? 'warning' : 'primary'"
                      :prepend-icon="item.isAdmin ? 'mdi-shield-off-outline' : 'mdi-shield-account-outline'"
                    >
                      {{ item.isAdmin ? $t('project.detail.members.removeAdmin') : $t('project.detail.members.setAdmin') }}
                    </v-btn>
                  </SetProjectAdmin>
                  <ProjectMemberDelete :member="item" @after="onGetProject">
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      icon="mdi-delete-outline"
                      aria-label="Remove project member"
                    />
                  </ProjectMemberDelete>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectEdit from '@/components/project/ProjectEdit.vue'
import ProjectDelete from '@/components/project/ProjectDelete.vue'

import { useAppStore } from '@/stores/app'
import { getGetProject } from '@/apis/project'
import { useRouter } from 'vue-router'
import { getGetSprints, deleteDeleteSprint } from '@/apis/sprint';
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import { uuidToColor } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
import SetProjectAdmin from '@/components/project/SetProjectAdmin.vue'
import ProjectMemberDelete from '@/components/project/ProjectMemberDelete.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const { t } = useI18n()
const router = useRouter()
const store = useAppStore()

const route = useRoute()

const tab = ref('sprints')
const project = ref({})
const allMembers = ref([])
const search = ref('')
const {
  loading: membersLoading,
  ready: membersReady,
  run: runMembersLoading
} = useDelayedLoading()
const {
  loading: sprintsLoading,
  ready: sprintsReady,
  run: runSprintsLoading
} = useDelayedLoading()

const headers = computed(() => [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: t('project.detail.members.name'), key: 'userName' },
  { title: t('project.detail.members.role'), key: 'role' },
  { title: t('project.detail.members.actions'), key: 'actions', sortable: false, align: 'end' },
])

function onGetProject() {
  void runMembersLoading(async () => {
    const res = await getGetProject(store.org.id, route.params.projectId)
    if (res.status === 200) {
      store.setProject(res.data.item)
      project.value = res.data.item
      allMembers.value = res.data.item.members
    }
  }).catch(() => {})
}

onMounted(() => {
  onGetProject()
  LoadSprints()
})

const date = ref([null, null])
const startDate = ref('')
const endDate = ref('')
const rangeDate = ref('')
const sprints = ref([])

watch(date, (date) => {
  startDate.value = date[0] ? date[0] : '';
  endDate.value = date[1] ? date[1] : '';
  if (date[0] > date[1]) {
    startDate.value = date[1] ? date[1] : '';
    startDate.value = date[0] ? date[0] : '';
  }
  rangeDate.value = `${startDate.value} - ${endDate.value}`;
})


function LoadSprints() {
  void runSprintsLoading(async () => {
    const res = await getGetSprints(store.org.id, route.params.projectId, {
      page: 1,
      size: 999
    })
    if (res.status === 200) {
      sprints.value = res.data.items;
      if (store.sprint.id === 0) {
        const currentSprint = sprints.value.find((item) => item.status === 'Current')
        if (currentSprint) {
          store.setSprint({
            id: currentSprint.id,
            name: currentSprint.name,
            startDate: currentSprint.startDate,
            endDate: currentSprint.endDate,
            burndownType: currentSprint.burndownType,
          })
        }
      }
    }
  }).catch(() => {})
}

function onSetSprint(id, name, startDate, endDate, burndownType) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate,
    burndownType: burndownType,
  })
  router.push(`/orgs/${store.org.id}/projects/${route.params.projectId}/sprints/${id}`)
}

function onDeleteSprint(projectId, id) {
  deleteDeleteSprint(store.org.id, projectId, id).then((res) => {
    if (res.status === 200) {
      if (res.data.success) {
        if (store.sprint.id === id) {
          store.clearSprint()
        }
      }
      LoadSprints()
    }
  })
}
</script>

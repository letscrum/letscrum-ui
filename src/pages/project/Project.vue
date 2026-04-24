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
        <div class="d-flex align-center" style="gap: 4px;">
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

      <div class="ado-subheader" style="padding: 0 8px;">
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

    <div class="pa-4">
      <p v-if="project.description" class="text-body-2 text-medium-emphasis mb-3">
        {{ project.description }}
      </p>

      <v-window v-model="tab" style="overflow: visible;">
        <!-- Sprints Tab -->
        <v-window-item value="sprints" style="overflow: visible;">
          <div class="d-flex align-center mb-3" style="gap: 8px;">
            <span class="text-overline text-medium-emphasis">{{ sprints.length }} sprint{{ sprints.length === 1 ? '' : 's' }}</span>
            <v-spacer />
            <SprintCreate @after-create="LoadSprints()">
              <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" size="small">
                {{ $t('project.detail.sprints.create') }}
              </v-btn>
            </SprintCreate>
          </div>

          <v-row v-if="sprints.length > 0" dense>
            <v-col v-for="(sprint, i) in sprints" :key="i" cols="12" sm="6" md="4" lg="3">
              <SprintCard
                :sprint="sprint"
                @enter="(s) => onSetSprint(s.id, s.name, s.startDate, s.endDate, s.burndownType)"
                @refresh="LoadSprints"
                @delete="(id) => onDeleteSprint(sprint.projectId, id)"
              />
            </v-col>
          </v-row>

          <div v-else class="d-flex flex-column align-center justify-center py-12">
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
          <v-card flat class="ado-border" rounded="md">
            <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b" style="gap: 8px;">
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
                style="max-width: 240px;"
              />
              <v-btn icon="mdi-refresh" variant="text" size="small" density="comfortable" @click="onGetProject" />
            </div>

            <v-data-table
              :headers="headers"
              :items="allMembers"
              :search="search"
              hover
              density="compact"
            >
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
                      density="comfortable"
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

const { t } = useI18n()
const router = useRouter()
const store = useAppStore()

const route = useRoute()

const tab = ref('sprints')
const project = ref({})
const allMembers = ref([])
const search = ref('')

const headers = computed(() => [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: t('project.detail.members.name'), key: 'userName' },
  { title: t('project.detail.members.role'), key: 'role' },
  { title: t('project.detail.members.actions'), key: 'actions', sortable: false, align: 'end' },
])

function onGetProject() {
  getGetProject(store.org.id, route.params.projectId).then((res) => {
    if (res.status === 200) {
      store.setProject(res.data.item)
      project.value = res.data.item
      allMembers.value = res.data.item.members
    }
  });
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
  getGetSprints(store.org.id, route.params.projectId, {
    page: 1,
    size: 999
  }).then((res) => {
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
  })
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

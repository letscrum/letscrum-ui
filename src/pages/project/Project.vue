<template>
  <DefaultLayout>
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-2">
            <v-avatar
              size="64"
              rounded="lg"
              :color="uuidToColor(project.id || '')"
              class="mr-4 elevation-2"
            >
              <span class="text-h4 font-weight-bold text-white">
                {{ (project.displayName || project.name || '').substring(0, 1).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold text-primary">{{ project.displayName || project.name }}</h1>
              <div class="text-subtitle-1 text-medium-emphasis">
                {{ project.name }}
              </div>
            </div>
          </div>
          <p class="text-body-1 mt-4">{{ project.description }}</p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <ProjectEdit @after-update="onGetProject">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-pencil"
              class="mr-2"
            >
              {{ $t('project.detail.edit') }}
            </v-btn>
          </ProjectEdit>

          <ProjectDelete>
            <v-btn
              variant="outlined"
              color="error"
              prepend-icon="mdi-delete"
            >
              {{ $t('project.detail.delete') }}
            </v-btn>
          </ProjectDelete>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <!-- Tabs Section -->
      <v-tabs v-model="tab" color="primary" class="mb-6">
        <v-tab value="sprints">{{ $t('project.detail.tabs.sprints') }}</v-tab>
        <v-tab value="members">{{ $t('project.detail.tabs.members') }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="overflow: visible;">
        <!-- Sprints Tab -->
        <v-window-item value="sprints" style="overflow: visible;">
          <v-row class="mb-4">
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <SprintCreate @after-create="LoadSprints()">
                <v-btn color="primary" prepend-icon="mdi-plus">
                  {{ $t('project.detail.sprints.create') }}
                </v-btn>
              </SprintCreate>
            </v-col>
          </v-row>

          <v-row v-if="sprints.length > 0">
            <v-col v-for="(sprint, i) in sprints" :key="i" cols="12" sm="6" md="4">
              <SprintCard
                :sprint="sprint"
                @enter="(s) => onSetSprint(s.id, s.name, s.startDate, s.endDate, s.burndownType)"
                @refresh="LoadSprints"
                @delete="(id) => onDeleteSprint(sprint.projectId, id)"
              />
            </v-col>
          </v-row>

          <v-row v-else justify="center" class="mt-8">
            <v-col cols="12" class="text-center">
              <v-icon size="64" color="grey-lighten-1">mdi-run</v-icon>
              <h3 class="text-h6 text-grey-darken-1 mt-4">{{ $t('project.detail.sprints.empty') }}</h3>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Members Tab -->
        <v-window-item value="members">
          <v-card rounded="lg" elevation="2">
            <v-card-title class="d-flex align-center pa-4">
              <v-icon icon="mdi-account-group" class="mr-2" color="primary"></v-icon>
              {{ $t('project.detail.tabs.members') }}
              <v-spacer></v-spacer>

              <v-text-field
                v-model="search"
                density="compact"
                :label="$t('user.list.search')"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
                class="mr-4"
                style="max-width: 300px;"
              ></v-text-field>

              <v-btn icon="mdi-refresh" variant="text" @click="onGetProject"></v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-data-table
              :headers="headers"
              :items="allMembers"
              :search="search"
              hover
            >
              <template #[`item.avatar`]="{ item }">
                <UserAvatar :user-id="item.userId" :user-name="item.userName" size="32" />
              </template>

              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="item.userName == project.createdUser?.name ? 'warning' : (item.isAdmin ? 'primary' : 'default')"
                  size="small"
                  variant="flat"
                >
                  {{ item.userName == project.createdUser?.name ? $t('project.detail.members.owner') : (item.isAdmin ? $t('project.detail.members.admin') : $t('project.detail.members.member')) }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <div v-if="item.userName != project.createdUser?.name" class="d-flex align-center justify-end">
                  <SetProjectAdmin :member="item" @after="onGetProject">
                    <v-btn
                      size="small"
                      :variant="item.isAdmin ? 'outlined' : 'tonal'"
                      :color="item.isAdmin ? 'warning' : 'primary'"
                      class="mr-2"
                      :prepend-icon="item.isAdmin ? 'mdi-shield-off' : 'mdi-shield-account'"
                    >
                      {{ item.isAdmin ? $t('project.detail.members.removeAdmin') : $t('project.detail.members.setAdmin') }}
                    </v-btn>
                  </SetProjectAdmin>

                  <ProjectMemberDelete :member="item" @after="onGetProject">
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      icon="mdi-delete"
                    ></v-btn>
                  </ProjectMemberDelete>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>
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
    console.log(res)
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
    console.log(res);
    if (res.status === 200) {
      sprints.value = res.data.items;
      // get sprints status 'Current' item and set to store
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
    console.log(res)
    if (res.status === 200) {
      if (res.data.success) {
        // if the deleted sprint is the current sprint, clean the store
        if (store.sprint.id === id) {
          store.clearSprint()
        }
      }
      LoadSprints()
    }
  })
}
</script>

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
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-pencil"
            class="mr-2"
            @click="onGetProject()"
          >
            {{ $t('project.detail.edit') }}
            <v-dialog
              v-model="dialogUpdate"
              activator="parent"
              width="50%"
              persistent
            >
              <v-card
                prepend-icon="mdi-pencil"
                :title="$t('project.detail.edit')"
              >
                <v-divider class="my-1"></v-divider>

                <v-card-text class="px-4">
                  <v-text-field v-model="project.displayName" label="Display Name"></v-text-field>

                  <v-textarea v-model="project.description" label="Description"></v-textarea>

                  <v-autocomplete
                    v-model:search-input="search"
                    v-model="admins"
                    chips
                    :items="users"
                    label="Admins"
                    multiple
                    item-props
                    no-filter
                    @update:search="searchUsers"
                  >
                    <template #chip="{ props, item }">
                      <v-chip
                        :closable="!item.raw.owner"
                        v-bind="props"
                        :text="item.raw.name"
                      ></v-chip>
                    </template>
                    <template #item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.name"
                      ></v-list-item>
                    </template>
                  </v-autocomplete>

                  <v-autocomplete
                    v-model:search-input="search"
                    v-model="members"
                    chips
                    :items="users"
                    label="Members"
                    multiple
                    item-props
                    no-filter
                    @update:search="searchUsers"
                  >
                    <template #chip="{ props, item }">
                      <v-chip
                        :closable="!item.raw.owner"
                        v-bind="props"
                        :text="item.raw.name"
                      ></v-chip>
                    </template>
                    <template #item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :title="item.raw.name"
                      ></v-list-item>
                    </template>
                  </v-autocomplete>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-btn
                    text="Close"
                    @click="dialogUpdate = false"
                  ></v-btn>

                  <v-spacer></v-spacer>

                  <v-btn
                    color="primary"
                    text="Save"
                    variant="flat"
                    @click="onUpdateProject()"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>

          <v-btn
            variant="outlined"
            color="error"
            prepend-icon="mdi-delete"
          >
            {{ $t('project.detail.delete') }}
            <v-dialog
              v-model="dialogDelete"
              activator="parent"
              max-width="400"
              persistent
            >
              <v-card
                prepend-icon="mdi-alert"
                title="Delete Project?"
                text="Are you sure you want to delete this project? This action cannot be undone."
              >
                <template #actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="dialogDelete = false">Cancel</v-btn>
                  <v-btn color="error" @click="onDeleteProject()">Delete</v-btn>
                </template>
              </v-card>
            </v-dialog>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <!-- Tabs Section -->
      <v-tabs v-model="tab" color="primary" class="mb-6">
        <v-tab value="sprints">{{ $t('project.detail.tabs.sprints') }}</v-tab>
        <v-tab value="members">{{ $t('project.detail.tabs.members') }}</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- Sprints Tab -->
        <v-window-item value="sprints">
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
              <v-card variant="outlined" class="h-100">
                <v-card-item>
                  <template #prepend>
                    <v-icon color="primary" icon="mdi-run-fast" size="large"></v-icon>
                  </template>
                  <v-card-title>{{ sprint.name }}</v-card-title>
                  <v-card-subtitle>
                    {{ new Date(sprint.startDate * 1000).toLocaleDateString() }} -
                    {{ new Date(sprint.endDate * 1000).toLocaleDateString() }}
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                  <v-chip
                    :color="sprint.status === 'CURRENT' ? 'success' : 'default'"
                    size="small"
                    class="mb-2"
                  >
                    {{ sprint.status }}
                  </v-chip>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click="onSetSprint(sprint.id, sprint.name, sprint.startDate, sprint.endDate, sprint.burndownType)"
                  >
                    {{ $t('project.detail.sprints.enter') }}
                  </v-btn>
                  <v-spacer></v-spacer>

                  <SprintEdit :sprint-id="sprint.id" @after-edit="LoadSprints()">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="grey"></v-btn>
                  </SprintEdit>

                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="onDeleteSprint(sprint.projectId, sprint.id)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
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
          <v-card variant="outlined">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left" width="80"></th>
                  <th class="text-left">{{ $t('project.detail.members.name') }}</th>
                  <th class="text-left">{{ $t('project.detail.members.role') }}</th>
                  <th class="text-right">{{ $t('project.detail.members.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in allMembers" :key="item.userId">
                  <td>
                    <user-avatar :user-id="item.userId" :user-name="item.userName"></user-avatar>
                  </td>
                  <td class="font-weight-medium">{{ item.userName }}</td>
                  <td>
                    <v-chip
                      :color="item.userName == project.createdUser?.name ? 'warning' : (item.isAdmin ? 'primary' : 'default')"
                      size="small"
                    >
                      {{ item.userName == project.createdUser?.name ? $t('project.detail.members.owner') : (item.isAdmin ? $t('project.detail.members.admin') : $t('project.detail.members.member')) }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    <div v-if="item.userName != project.createdUser?.name">
                      <SetProjectAdmin :member="item" @after="onGetProject">
                        <v-btn size="small" variant="text" :color="item.isAdmin ? 'warning' : 'primary'">
                          {{ item.isAdmin ? $t('project.detail.members.removeAdmin') : $t('project.detail.members.setAdmin') }}
                        </v-btn>
                      </SetProjectAdmin>

                      <ProjectMemberDelete :member="item" @after="onGetProject">
                        <v-btn size="small" variant="text" color="error" icon="mdi-delete"></v-btn>
                      </ProjectMemberDelete>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { getGetProject, putUpdateProject, deleteDeleteProject } from '@/apis/project'
import { getGetOrgMembers } from '@/apis/org'
import { useRouter } from 'vue-router'
import { getGetSprints, deleteDeleteSprint } from '@/apis/sprint';
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { uuidToColor } from '@/utils/utils'

const router = useRouter()
const store = useAppStore()

const route = useRoute()

const tab = ref('sprints')
const project = ref({})
const admins = ref([])
const members = ref([])
const allMembers = ref([])
const users = ref([])
const search = ref('')
const dialogUpdate = ref(false)
const dialogDelete = ref(false)

const searchUsers = val => {
  if (!val) {
    users.value = []
    return false
  }

  getGetOrgMembers(store.org.id).then((res) => {
    console.log(res)
    if (res.status === 200) {
      users.value = res.data.items.filter((user) => user.member.name.includes(val)).map((item) => {
        return {
          id: item.member.id,
          name: item.member.name,
          isAdmin: item.isAdmin,
          owner: item.member.id === store.user.id ? true : false
        }
      })
      console.log(members.value)
    }
  })
}

function onGetProject() {
  getGetProject(store.org.id, route.params.projectId).then((res) => {
    console.log(res)
    if (res.status === 200) {
      store.setProject(res.data.item)
      project.value = res.data.item
      allMembers.value = res.data.item.members
      admins.value = res.data.item.members.filter((member) => member.isAdmin).map((member) => ({
        id: member.userId,
        name: member.userName,
        isAdmin: member.isAdmin,
        owner: res.data.item.createdUser.id === member.userId ? true : false
      }))
      members.value = res.data.item.members.filter((member) => !member.isAdmin).map((member) => ({
        id: member.userId,
        name: member.userName,
        isAdmin: member.isAdmin,
        owner: res.data.item.createdUser.id === member.userId ? true : false
      }))
    }
  });
}

function onUpdateProject() {
  // set all isAdmin to true in admins
  admins.value = admins.value.map((admin) => {
    admin.isAdmin = true
    return admin
  })
  // set all isAdmin to false in members
  members.value = members.value.map((member) => {
    member.isAdmin = false
    return member
  })
  // remove the owner from the admins
  admins.value = admins.value.filter((admin) => {
    return !admin.owner
  })
  // combine the admins and members
  let allMembers = admins.value.concat(members.value)

  putUpdateProject(store.org.id, route.params.projectId, {
    displayName: project.value.displayName,
    description: project.value.displayName,
    members: allMembers.map((member) => {
      return {
        userId: member.id,
        userName: member.name,
        isAdmin: member.isAdmin,
      }
    })
  }).then((res) => {
    console.log(res)
    if (res.status === 200) {
      if (res.data.success) {
        store.setProject({
          id: res.data.id,
          displayName: project.value.displayName,
          description: project.value.displayName,
          myRole: project.value.myRole,
        })
      }
    }
  })
  console.log(project.value)
  console.log(members.value)
  dialogUpdate.value = false
}

function onDeleteProject() {
  deleteDeleteProject(store.org.id, route.params.projectId).then((res) => {
    console.log(res)
    if (res.status === 200) {
      if (res.data.success) {
        store.clearProject()
        store.clearSprint()
        dialogDelete.value = false
        router.push(`/orgs/${store.org.id}/projects`);
      }
    }
  })
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

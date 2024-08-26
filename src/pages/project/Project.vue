<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>{{ store.project.displayName }}</h2>
      </v-col>
      <v-col>
        <v-dialog
          v-model="dialogDelete"
          max-width="400"
          persistent
        >
          <template #activator="{ props: activatorProps }">
            <v-btn outlined class="float-right ml-2" color="red" density="comfortable" icon="mdi-delete" v-bind="activatorProps">
            </v-btn>
          </template>

          <v-card
            prepend-icon="mdi-map-marker"
            text="Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running."
            title="Use Google's location service?"
          >
            <template #actions>
              <v-spacer></v-spacer>

              <v-btn @click="dialogDelete = false">
                Disagree
              </v-btn>

              <v-btn @click="onDeleteProject()">
                Agree
              </v-btn>
            </template>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogUpdate"
          width="50%"
          persistent
        >
          <template #activator="{ props: activatorProps }">
            <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onGetProject()">
              Edit
            </v-btn>
          </template>

          <template #default="{ isActive }">
            <v-card
              prepend-icon="mdi-earth"
              title="Select Country"
            >
              <v-divider class="my-1"></v-divider>

              <v-card-text class="px-4">
                <v-text-field v-model="project.displayName" label="Label"></v-text-field>

                <v-textarea v-model="project.description" label="Label"></v-textarea>

                <v-autocomplete
                  v-model:search-input="search"
                  v-model="admins"
                  chips
                  :items="users"
                  label="Autocomplete"
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
                  label="Autocomplete"
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
                  @click="isActive.value = false"
                ></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  color="surface-variant"
                  text="Save"
                  variant="flat"
                  @click="onUpdateProject()"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row no-gutters>
      <v-col>
        {{ project }}
      </v-col>
    </v-row>
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon>
        Members
      </v-card-title>
      <v-spacer></v-spacer>

      <v-divider></v-divider>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in allMembers"
            :key="item.userId"
          >
            <td>{{ item.userName }}</td>
            <td>
              <div v-if="item.userName == project.createdUser.name">
                Owner
              </div>
              <SetProjectAdmin v-else :member="item" @after="onGetProject">
                <v-btn>
                  {{ item.isAdmin ? 'Remove admin' : 'Set admin' }}
                </v-btn>
              </SetProjectAdmin>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-row no-gutters>
      <v-col>
        <h2>Sprints</h2>
      </v-col>
      <v-col>
        <SprintCreate @after-create="LoadSprints()">
          <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil">
            Create
          </v-btn>
        </SprintCreate>
        <!-- <v-menu offset-y bottom left min-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" plain tile large class="float-right">
              {{ store.sprint.name }}
              <v-icon right>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-virtual-scroll height="350" item-height="64" :items="sprints">
              <template v-slot:default="{ item }">
                <v-list-item
                  :to="'/projects/' + project.id + '/sprints/' + item.id"
                  two-line
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(item.startDate * 1000).toISOString().substr(0, 10) }}
                      - {{ new Date(item.endDate * 1000).toISOString().substr(0, 10) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <v-chip
                        :color="item.status === 'CURRENT' ? 'primary' : ''"
                        small
                      >
                        {{ item.status }}
                      </v-chip>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
          <v-list>
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>New Sprint</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Create Sprint</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Name"
                          required
                          v-model="sprintName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="rangeDate"
                              label="Picker without buttons"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            no-title
                            range
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn text @click="onCreateSprint">
                    Create
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-menu> -->
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row no-gutters>
      <v-col v-for="(sprint, i) in sprints" :key="i" cols="12" md="4" class="pa-1">
        {{ sprint }}
        <v-btn
          color="primary"
          @click="onSetSprint(sprint.id, sprint.name, sprint.startDate, sprint.endDate)">
          {{ sprint.name }}
        </v-btn>
        <v-btn
          color="primary"
          @click="onDeleteSprint(sprint.projectId, sprint.id)">
          Delete
        </v-btn>
      </v-col>
    </v-row>
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

const router = useRouter()
const store = useAppStore()

const route = useRoute()

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
        store.setProject({})
        store.setSprint({})
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
            endDate: currentSprint.endDate
          })
        }
      }
    }
  })
}

function onSetSprint(id, name, startDate, endDate) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate
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

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
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn outlined class="float-right ml-2" color="red" density="comfortable" icon="mdi-delete" v-bind="activatorProps">
            </v-btn>
          </template>

          <v-card
            prepend-icon="mdi-map-marker"
            text="Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running."
            title="Use Google's location service?"
          >
            <template v-slot:actions>
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
          width="50%"
          persistent
          v-model="dialogUpdate"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onGetProject()">
              Edit
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card
              prepend-icon="mdi-earth"
              title="Select Country"
            >
              <v-divider class="my-1"></v-divider>

              <v-card-text class="px-4">
                <v-text-field label="Label" v-model="project.displayName"></v-text-field>

                <v-textarea label="Label" v-model="project.description"></v-textarea>

                <v-autocomplete
                  v-model:search-input="search"
                  v-model="members"
                  chips
                  :items="users"
                  label="Autocomplete"
                  multiple
                  @update:search="searchUsers"
                  item-props
                  no-filter
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip :closable="!item.raw.owner"
                      v-bind="props"
                      :text="item.raw.name"
                    ></v-chip>
                  </template>
                  <template v-slot:item="{ props, item }">
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
      <!-- <v-col cols="12" md="4" class="pa-1" v-for="(project, i) in projects" :key="i">
        <ProjectCard :project="project"></ProjectCard>
      </v-col> -->
    </v-row>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue';
import { getGetProject, putUpdateProject, deleteDeleteProject } from '@/apis/project'
import { getUsers } from '@/apis/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useAppStore()
import { useRoute } from 'vue-router'

const route = useRoute()

const project = ref({})
const members = ref([])
const users = ref([])
const search = ref()
const dialogUpdate = ref(false)
const dialogDelete = ref(false)

const searchUsers = val => {
  if (!val) {
    users.value = []
    return false
  }
  getUsers({
    keyword: val,
    page: 1,
    size: 999,
  }).then(res => {
    if (res.status === 200) {
      users.value = res.data.items
      console.log(members.value)
    }
  })
}

function onGetProject() {
  getGetProject(route.params.projectId).then((res) => {
    console.log(res)
    if (res.status === 200) {
      store.setProject({
        id: res.data.item.id,
        name: res.data.item.name,
        displayName: res.data.item.displayName,
        description: res.data.item.description,
      })
      store.setSprint({
        id: res.data.item.currentSprint.id,
        name: res.data.item.currentSprint.name,
        startDate: res.data.item.currentSprint.startDate,
        endDate: res.data.item.currentSprint.endDate
      })
      project.value = res.data.item
      members.value = res.data.item.members.map((item) => ({
        id: item.userId,
        name: item.userName,
        owner: res.data.item.createdUser.id === item.userId ? true : false
      }))
      console.log(members.value)
    }
  });
}

function onUpdateProject() {
  putUpdateProject(route.params.projectId, {
    displayName: project.value.displayName,
    description: project.value.displayName,
    members: members.value.map((member) => {
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
        })
      }
    }
  })
  console.log(project.value)
  console.log(members.value)
  dialogUpdate.value = false
}

function onDeleteProject() {
  deleteDeleteProject(route.params.projectId).then((res) => {
    console.log(res)
    if (res.status === 200) {
      if (res.data.success) {
        store.setProject({})
        store.setSprint({})
        dialogDelete.value = false
        router.push(`/projects`);
      }
    }
  })
}


onMounted(() => {
  project.value = store.project
})
</script>
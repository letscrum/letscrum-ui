<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>Project List</h2>
      </v-col>
      <v-col>
        <v-dialog
          width="50%"
          persistent
          v-model="dialog"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenCreate()">
              Create
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
                  v-model="admins"
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
                  @click="createProject()"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="4" class="pa-1" v-for="(project, i) in projects" :key="i">
        <ProjectCard :project="project"></ProjectCard>
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, computed, ref } from 'vue';

const store = useAppStore()

import { getGetProjects, postCreateProject } from '@/apis/project';
import { getGetUsers } from '@/apis/user'

const projects = ref([])
const project = ref({})
const admins = ref([])
const members = ref([])
const users = ref([])
const search = ref()
const dialog = ref(false)


const searchUsers = val => {
  if (!val) {
    users.value = []
    return false
  }
  getGetUsers({
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


function onOpenCreate() {
  project.value = {}
  admins.value = [{
    id: store.user.id,
    name: store.user.name,
    isAdmin: true,
    owner: true
  }]
  members.value = []
  dialog.value = true
}

function createProject() {
  console.log(project.value)
  console.log(admins.value)
  console.log(members.value)
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

  postCreateProject(store.org.id, {
    displayName: project.value.displayName,
    description: project.value.description,
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
      LoadProjects()
      dialog.value = false
    }
  })
}

onMounted(() => {
  LoadProjects()
})

function LoadProjects() {
  getGetProjects(store.org.id, {
    page: 1,
    size: 12
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      projects.value = res.data.items;
    }
  });
}

const pages = computed({
  get() {
    return Math.ceil(this.total / this.size);
  }
})
</script>

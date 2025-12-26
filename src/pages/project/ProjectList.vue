<template>
  <DefaultLayout>
    <v-container fluid class="pa-6">
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="8">
          <h1 class="text-h4 font-weight-bold text-primary">{{ $t('project.list.title') }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis mt-1">
            {{ $t('project.list.subtitle') }}
          </p>
        </v-col>
        <v-col cols="12" sm="4" class="text-sm-right">
          <v-dialog
            v-model="dialog"
            width="50%"
            persistent
          >
            <template #activator="{ props: activatorProps }">
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                elevation="2"
                size="large"
                v-bind="activatorProps"
                @click="onOpenCreate()"
              >
                {{ $t('project.list.createBtn') }}
              </v-btn>
            </template>

            <template #default="{ isActive }">
              <v-card
                prepend-icon="mdi-earth"
                title="Select Country"
              >
                <v-divider class="my-1"></v-divider>

                <v-card-text class="px-4">
                  <v-text-field v-model="project.name" label="Label"></v-text-field>

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
                    @click="createProject()"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col
          v-for="n in 4"
          :key="n"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader
            class="mx-auto border"
            max-width="300"
            type="card-avatar, actions"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row v-else-if="projects.length > 0">
        <v-col
          v-for="(p, i) in projects"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <ProjectCard :project="p"></ProjectCard>
        </v-col>
      </v-row>

      <v-row v-else justify="center" class="mt-12">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-folder-open-outline</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mt-4">{{ $t('project.list.emptyTitle') }}</h3>
          <p class="text-body-2 text-grey mt-2">{{ $t('project.list.emptySubtitle') }}</p>
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue';

const store = useAppStore()

import { getGetProjects, postCreateProject } from '@/apis/project'
import { getGetOrgMembers } from '@/apis/org'
import { onBeforeRouteUpdate } from 'vue-router';

const projects = ref([])
const project = ref({})
const admins = ref([])
const members = ref([])
const users = ref([])
const search = ref()
const dialog = ref(false)
const loading = ref(true)


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
    name: project.value.name,
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

onBeforeRouteUpdate(() => {
  LoadProjects()
})

function LoadProjects() {
  loading.value = true
  getGetProjects(store.org.id, {
    page: 1,
    size: 12
  }).then((res) => {
    console.log('projects', res);
    if (res.status === 200) {
      projects.value = res.data.items;
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  });
}

// const pages = computed({
//   get() {
//     return Math.ceil(this.total / this.size);
//   }
// })
</script>

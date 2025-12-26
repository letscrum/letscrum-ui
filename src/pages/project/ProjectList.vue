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
          <ProjectCreate @after-create="LoadProjects">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              elevation="2"
              size="large"
            >
              {{ $t('project.list.createBtn') }}
            </v-btn>
          </ProjectCreate>
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
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectCreate from '@/components/project/ProjectCreate.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue';

const store = useAppStore()

import { getGetProjects } from '@/apis/project'
import { onBeforeRouteUpdate } from 'vue-router';

const projects = ref([])
const loading = ref(true)


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

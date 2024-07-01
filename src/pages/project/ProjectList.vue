<template>
  <DefaultLayout>
    <div class="ma-2">
      <v-row no-gutters>
        <v-col>
          <h2 class="pa-1">Project List</h2>
        </v-col>
        <v-col>

        </v-col>
      </v-row>
      <v-divider class="my-1"></v-divider>
      <v-row no-gutters>
        <v-col cols="12" md="4" class="pa-1" v-for="(project, i) in projects" :key="i">
          <ProjectCard :project="project"></ProjectCard>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, computed, ref } from 'vue';

const store = useAppStore()

import { getGetProjects } from '@/apis/project';

const projects = ref([])

onMounted(() => {
  getGetProjects({
    page: 1,
    size: 12
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      projects.value = res.data.items;
      console.log(projects);
    }
  });
})

const pages = computed({
  get() {
    return Math.ceil(this.total / this.size);
  }
})
</script>

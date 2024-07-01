<template>
  <DefaultLayout>
  <div class="ma-2">
  <v-row no-gutters>
    <v-col>
      <h2>{{ project.name }}</h2>
    </v-col>
    <v-col>
      <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil">
        Edit
      </v-btn>
    </v-col>
  </v-row>
  <v-divider class="my-2"></v-divider>
  </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, computed, ref } from 'vue';
import { getGetProject } from '@/apis/project'

const project = ref({})

const store = useAppStore()

onMounted(() => {
  getGetProject(1).then((res) => {
    console.log(res);
    if (res.status === 200) {
      project.value = res.data.item
    }
  });
})
</script>

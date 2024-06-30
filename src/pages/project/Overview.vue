<template>
  <div class="ma-2">
  <v-row no-gutters>
    <v-col>
      <h2 class="pa-1">{{ project.name }}</h2>
    </v-col>
    <v-col>
      <v-btn outlined class="float-right ma-1" tile>
        <v-icon left>
          mdi-pencil
        </v-icon>
        Edit Project
      </v-btn>
    </v-col>
  </v-row>
  <v-divider class="my-1"></v-divider>
  <v-row no-gutters>
    <v-col cols="12" md="4" class="pa-1" v-for="(project, i) in projects" :key="i">
      <project-card :project="project"></project-card>
    </v-col>
  </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProjectOverview',
  data: () => ({
    size: 12,
    page: 0,
    total: 0,
    projects: []
  }),
  computed: {
    ...mapGetters(['project', 'sprint'])
  },
  created() {
  },
  methods: {
  }
};
</script>

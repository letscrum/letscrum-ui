<template>
  <v-card
    class="mx-auto"
    outlined
    tile
    @click="onLoadProject"
  >
    <v-list-item three-line>
      <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar>
      <v-list-item-content>
        <div class="text-overline mb-4">
          {{ project.members.length }} Members
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ project.displayName }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { getGetProject } from '@/apis/project';
import { mapMutations } from 'vuex';

export default {
  name: 'ProjectCard',
  props: ['project'],
  methods: {
    ...mapMutations(['setProject', 'setSprint']),
    onLoadProject() {
      getGetProject(this.project.id).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.setProject({
            id: res.data.item.id,
            name: res.data.item.name,
            displayName: res.data.item.displayName
          });
          this.setSprint({
            id: res.data.item.sprint.id,
            name: res.data.item.sprint.name,
            startDate: res.data.item.sprint.startDate,
            endDate: res.data.item.sprint.endDate
          });
          this.$router.push(`/projects/${this.project.id}/overview`);
        }
      });
    }
  }
};
</script>

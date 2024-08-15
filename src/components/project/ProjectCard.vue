<template>
  <v-card
    class="mx-auto"
    outlined
    tile
    @click="onLoadProject"
  >
    <v-list-item three-line>
      <v-list-item-subtitle>
        <div class="text-overline">
          {{ project.members.length }} Members
        </div>
      </v-list-item-subtitle>
      <v-list-item-title class="text-h5">
        {{ project.name }}
      </v-list-item-title>
      <template #prepend>
        <v-avatar size="x-large" rounded="0" :color="uuidToColor(project.id)">{{ project.name.substring(0, 1) }}</v-avatar>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
import { getGetProject } from '@/apis/project'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { uuidToColor } from '@/utils/utils'

const store = useAppStore()
const router = useRouter()

const props = defineProps(['project'])

function onLoadProject() {
  getGetProject(store.org.id, props.project.id).then((res) => {
    console.log(res);
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
      });
      router.push(`/orgs/${store.org.id}/projects/${res.data.item.id}`);
    }
  });
}
</script>

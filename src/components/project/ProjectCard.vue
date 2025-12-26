<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      :elevation="isHovering ? 2 : 0"
      border
      variant="flat"
      class="mx-auto transition-swing cursor-pointer h-100"
      rounded="lg"
      @click="onLoadProject"
    >
      <v-card-item>
        <template #prepend>
          <v-avatar
            size="48"
            rounded="lg"
            :color="uuidToColor(project.id)"
            variant="tonal"
          >
            <span class="text-h6 font-weight-bold">
              {{ (project.displayName || project.name).substring(0, 1).toUpperCase() }}
            </span>
          </v-avatar>
        </template>
        <v-card-title class="text-h6 font-weight-bold pt-0">
          {{ project.displayName || project.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ project.name }}
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pt-2">
        <div class="text-body-2 text-medium-emphasis text-truncate-2">
          {{ project.description || 'No description available' }}
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-chip
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-account-group"
        >
          {{ project.members ? project.members.length : 0 }} {{ $t('project.card.members') }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          icon="mdi-arrow-right"
          size="small"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
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
      store.setProject(res.data.item);
      store.setSprint(res.data.item.currentSprint);
      router.push(`/orgs/${store.org.id}/projects/${res.data.item.id}`);
    }
  });
}
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 2 : 0"
      class="ado-border cursor-pointer h-100 d-flex flex-column"
      rounded="md"
      @click="onLoadProject"
    >
      <div class="d-flex align-start pa-3" style="gap: 12px;">
        <v-avatar
          size="36"
          rounded="md"
          :color="uuidToColor(project.id)"
        >
          <span class="text-subtitle-2 font-weight-bold text-white">
            {{ (project.displayName || project.name).substring(0, 1).toUpperCase() }}
          </span>
        </v-avatar>
        <div style="min-width: 0;" class="flex-grow-1">
          <div class="text-body-1 font-weight-bold text-truncate">
            {{ project.displayName || project.name }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">{{ project.name }}</div>
        </div>
        <v-icon size="small" :color="isHovering ? 'primary' : undefined" :class="isHovering ? '' : 'text-medium-emphasis'">mdi-arrow-right</v-icon>
      </div>

      <div class="px-3 pb-2 flex-grow-1">
        <div class="text-body-2 text-medium-emphasis text-truncate-2" style="min-height: 36px;">
          {{ project.description || 'No description' }}
        </div>
      </div>

      <v-divider />
      <div class="d-flex align-center px-3 py-2">
        <v-icon size="x-small" class="mr-1 text-medium-emphasis">mdi-account-group-outline</v-icon>
        <span class="text-caption text-medium-emphasis">
          {{ project.members ? project.members.length : 0 }} {{ $t('project.card.members') }}
        </span>
        <v-spacer />
        <v-chip
          v-if="project.currentSprint && project.currentSprint.name"
          size="x-small"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-run-fast"
        >
          {{ project.currentSprint.name }}
        </v-chip>
      </div>
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
    if (res.status === 200) {
      store.setProject(res.data.item);
      store.setSprint(res.data.item.currentSprint);
      router.push(`/orgs/${store.org.id}/projects/${res.data.item.id}`);
    }
  });
}
</script>


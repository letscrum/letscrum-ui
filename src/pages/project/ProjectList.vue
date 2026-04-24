<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-icon class="mr-2" color="primary">mdi-folder-multiple-outline</v-icon>
        <span class="ado-subheader__title">{{ $t('project.list.title') }}</span>
        <span class="ado-subheader__sub d-none d-sm-inline">{{ $t('project.list.subtitle') }}</span>
        <v-spacer />
        <div class="d-flex align-center" style="gap: 8px;">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Filter projects"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            style="width: 220px;"
          />
          <v-btn-toggle v-model="viewMode" mandatory density="comfortable" variant="outlined" divided>
            <v-btn value="grid" icon="mdi-view-grid-outline" size="small" />
            <v-btn value="list" icon="mdi-view-list-outline" size="small" />
          </v-btn-toggle>
          <ProjectCreate @after-create="LoadProjects">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              size="small"
              variant="flat"
            >
              {{ $t('project.list.createBtn') }}
            </v-btn>
          </ProjectCreate>
        </div>
      </div>
    </template>

    <v-container fluid class="pa-4">
      <v-row v-if="loading" dense>
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader class="ado-border" type="article" />
        </v-col>
      </v-row>

      <template v-else-if="filteredProjects.length > 0">
        <v-row v-if="viewMode === 'grid'" dense>
          <v-col v-for="(p, i) in filteredProjects" :key="i" cols="12" sm="6" md="4" lg="3">
            <ProjectCard :project="p"></ProjectCard>
          </v-col>
        </v-row>

        <v-card v-else flat class="ado-border">
          <v-table>
            <thead>
              <tr>
                <th style="width: 40px;"></th>
                <th>Name</th>
                <th class="d-none d-md-table-cell">Description</th>
                <th style="width: 120px;">Members</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in filteredProjects"
                :key="p.id"
                class="cursor-pointer"
                @click="onOpenProject(p)"
              >
                <td>
                  <v-avatar size="24" rounded="sm" :color="uuidToColor(p.id)">
                    <span class="text-caption font-weight-bold text-white">
                      {{ (p.displayName || p.name).substring(0, 1).toUpperCase() }}
                    </span>
                  </v-avatar>
                </td>
                <td>
                  <div class="font-weight-medium">{{ p.displayName || p.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ p.name }}</div>
                </td>
                <td class="d-none d-md-table-cell text-medium-emphasis text-truncate" style="max-width: 480px;">
                  {{ p.description || '—' }}
                </td>
                <td>
                  <v-chip size="x-small" variant="tonal" prepend-icon="mdi-account-group-outline">
                    {{ p.members ? p.members.length : 0 }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>

      <div v-else class="d-flex flex-column align-center justify-center py-12">
        <v-icon size="56" class="text-medium-emphasis">mdi-folder-open-outline</v-icon>
        <h3 class="text-subtitle-1 font-weight-medium mt-4">{{ $t('project.list.emptyTitle') }}</h3>
        <p class="text-body-2 text-medium-emphasis mt-1">{{ $t('project.list.emptySubtitle') }}</p>
        <ProjectCreate @after-create="LoadProjects">
          <v-btn class="mt-4" color="primary" prepend-icon="mdi-plus" variant="flat">
            {{ $t('project.list.createBtn') }}
          </v-btn>
        </ProjectCreate>
      </div>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectCreate from '@/components/project/ProjectCreate.vue'

import { useAppStore } from '@/stores/app'
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { uuidToColor } from '@/utils/utils'

const store = useAppStore()
const router = useRouter()

import { getGetProjects, getGetProject } from '@/apis/project'

const projects = ref([])
const loading = ref(true)
const search = ref('')
const viewMode = ref('grid')

const filteredProjects = computed(() => {
  if (!search.value) return projects.value
  const q = search.value.toLowerCase()
  return projects.value.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.displayName || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  )
})

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
    size: 50
  }).then((res) => {
    if (res.status === 200) {
      projects.value = res.data.items;
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  });
}

function onOpenProject(p) {
  getGetProject(store.org.id, p.id).then((res) => {
    if (res.status === 200) {
      store.setProject(res.data.item);
      if (res.data.item.currentSprint) store.setSprint(res.data.item.currentSprint);
      router.push(`/orgs/${store.org.id}/projects/${res.data.item.id}`);
    }
  })
}
</script>

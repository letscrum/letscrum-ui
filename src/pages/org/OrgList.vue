<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-icon class="mr-2" color="primary">mdi-domain</v-icon>
        <span class="ado-subheader__title">{{ $t('org.list.title') }}</span>
        <span class="ado-subheader__sub d-none d-sm-inline">{{ $t('org.list.subtitle') }}</span>
        <v-spacer />
        <div class="ado-toolbar-actions">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Filter organizations"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="ado-toolbar-search"
          />
          <v-btn-toggle v-model="viewMode" mandatory variant="outlined" divided>
            <v-btn value="grid" icon="mdi-view-grid-outline" size="small" aria-label="Grid view" />
            <v-btn value="list" icon="mdi-view-list-outline" size="small" aria-label="List view" />
          </v-btn-toggle>
          <OrgCreate>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              size="small"
              variant="flat"
            >
              {{ $t('org.list.createBtn') }}
            </v-btn>
          </OrgCreate>
        </div>
      </div>
    </template>

    <v-container fluid class="ado-page ado-page--wide">
      <v-row v-if="loading" class="ado-entity-grid">
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader class="ado-border" type="article" />
        </v-col>
      </v-row>

      <template v-else-if="filteredOrgs.length > 0">
        <!-- Grid view -->
        <v-row v-if="viewMode === 'grid'" class="ado-entity-grid">
          <v-col v-for="(org, i) in filteredOrgs" :key="i" cols="12" sm="6" md="4" lg="3">
            <OrgCard :org="org" />
          </v-col>
        </v-row>

        <!-- List view -->
        <v-card v-else class="ado-panel">
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
                v-for="org in filteredOrgs"
                :key="org.id"
                class="cursor-pointer"
                role="link"
                tabindex="0"
                :aria-label="`Open organization ${org.displayName || org.name}`"
                @click="onOpenOrg(org)"
                @keydown.enter.prevent="onOpenOrg(org)"
                @keydown.space.prevent="onOpenOrg(org)"
              >
                <td>
                  <v-avatar size="24" rounded="sm" :color="uuidToColor(org.id)">
                    <span class="text-caption font-weight-bold text-white">
                      {{ (org.displayName || org.name).substring(0, 1).toUpperCase() }}
                    </span>
                  </v-avatar>
                </td>
                <td>
                  <div class="font-weight-medium">{{ org.displayName || org.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ org.name }}</div>
                </td>
                <td class="d-none d-md-table-cell text-medium-emphasis text-truncate" style="max-width: 480px;">
                  {{ org.description || '—' }}
                </td>
                <td>
                  <v-chip size="x-small" variant="tonal" prepend-icon="mdi-account-group-outline">
                    {{ org.members ? org.members.length : 0 }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>

      <div v-else class="ado-empty-state d-flex flex-column align-center justify-center">
        <v-icon size="56" class="text-medium-emphasis">mdi-domain-off</v-icon>
        <h3 class="text-subtitle-1 font-weight-medium mt-4">{{ $t('org.list.emptyTitle') }}</h3>
        <p class="text-body-2 text-medium-emphasis mt-1">{{ $t('org.list.emptySubtitle') }}</p>
        <OrgCreate>
          <v-btn class="mt-4" color="primary" prepend-icon="mdi-plus" variant="flat">
            {{ $t('org.list.createBtn') }}
          </v-btn>
        </OrgCreate>
      </div>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app'
import { uuidToColor } from '@/utils/utils'
import { getGetOrg, getGetOrgs } from '@/apis/org';

const orgs = ref([])
const loading = ref(true)
const search = ref('')
const viewMode = ref('grid')
const router = useRouter()
const store = useAppStore()

const filteredOrgs = computed(() => {
  if (!search.value) return orgs.value
  const q = search.value.toLowerCase()
  return orgs.value.filter(o =>
    (o.name || '').toLowerCase().includes(q) ||
    (o.displayName || '').toLowerCase().includes(q) ||
    (o.description || '').toLowerCase().includes(q)
  )
})

onMounted(() => {
  LoadOrgs()
})

function LoadOrgs() {
  loading.value = true
  getGetOrgs({
    page: 1,
    size: 50
  }).then((res) => {
    if (res.status === 200) {
      orgs.value = res.data.items;
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  });
}

function onOpenOrg(org) {
  getGetOrg(org.id).then((res) => {
    if (res.status === 200) {
      store.setOrg(res.data.item);
      router.push(`/orgs/${res.data.item.id}/projects`);
    }
  })
}
</script>

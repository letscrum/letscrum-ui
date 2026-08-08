<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-icon class="mr-2" color="primary">mdi-account-multiple-outline</v-icon>
        <span class="ado-subheader__title">{{ $t('user.list.title') }}</span>
        <v-chip size="x-small" variant="tonal" class="ml-2">{{ users.length }}</v-chip>
        <v-spacer />
        <div class="ado-toolbar-actions">
          <v-text-field
            v-model="search"
            density="compact"
            :placeholder="$t('user.list.search')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            clearable
            class="ado-toolbar-search"
            @update:model-value="fetchUsers"
          />
          <v-btn aria-label="Refresh users" icon="mdi-refresh" variant="text" size="small" @click="fetchUsers" />
          <UserCreate v-if="store.user.isSuperAdmin" @after-create="fetchUsers">
            <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" size="small">
              {{ $t('user.list.create') }}
            </v-btn>
          </UserCreate>
        </div>
      </div>
    </template>

    <div class="ado-page ado-page--wide">
      <v-card class="ado-panel">
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          hover
          density="compact"
        >
          <template #loading>
            <div class="ado-table-state">
              <v-progress-circular indeterminate color="primary" size="24" width="2" />
              <span>Loading users...</span>
            </div>
          </template>

          <template #no-data>
            <div v-if="ready" class="ado-table-state">
              <v-icon size="36" class="text-medium-emphasis">mdi-account-search-outline</v-icon>
              <span>{{ search ? 'No users match your search.' : 'No users available.' }}</span>
            </div>
          </template>

          <template #[`item.avatar`]="{ item }">
            <UserAvatar :user-id="item.id" :user-name="item.name" size="28" />
          </template>

          <template #[`item.isSuperAdmin`]="{ item }">
            <v-chip
              :color="item.isSuperAdmin ? 'primary' : undefined"
              size="x-small"
              variant="tonal"
            >
              {{ item.isSuperAdmin ? $t('user.list.role.superAdmin') : $t('user.list.role.user') }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="d-flex align-center justify-end" style="gap: 4px;">
              <UserEdit v-if="store.user.isSuperAdmin" :user="item" @after-update="fetchUsers">
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  icon="mdi-pencil-outline"
                  density="comfortable"
                />
              </UserEdit>
              <SetSuperAdmin v-if="store.user.isSuperAdmin && item.id !== store.user.id" :user="item" @after="fetchUsers">
                <v-btn
                  size="small"
                  variant="text"
                  :color="item.isSuperAdmin ? 'warning' : 'primary'"
                  :prepend-icon="item.isSuperAdmin ? 'mdi-shield-off-outline' : 'mdi-shield-account-outline'"
                >
                  {{ item.isSuperAdmin ? $t('user.list.actions.removeSuperAdmin') : $t('user.list.actions.setSuperAdmin') }}
                </v-btn>
              </SetSuperAdmin>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserCreate from '@/components/user/UserCreate.vue'
import UserEdit from '@/components/user/UserEdit.vue'
import SetSuperAdmin from '@/components/SetSuperAdmin.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { ref, onMounted, computed } from 'vue'
import { getGetUsers } from '@/apis/user'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const store = useAppStore()
const { t } = useI18n()

const search = ref('')
const users = ref([])
const { loading, ready, run: runLoading } = useDelayedLoading()

const headers = computed(() => [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: t('user.list.headers.name'), key: 'name' },
  { title: t('user.list.headers.email'), key: 'email' },
  { title: t('user.list.headers.role'), key: 'isSuperAdmin' },
  { title: t('user.list.headers.actions'), key: 'actions', sortable: false, align: 'end' },
])

function fetchUsers() {
  void runLoading(async () => {
    const res = await getGetUsers({
      page: 1,
      size: 999,
      keyword: search.value,
    })
    if (res.status === 200) users.value = res.data.items
  }).catch(() => {})
}

onMounted(() => {
  fetchUsers()
})
</script>

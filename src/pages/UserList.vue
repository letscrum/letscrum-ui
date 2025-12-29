<template>
  <DefaultLayout>
    <v-container fluid class="pa-6">
      <v-card rounded="lg" elevation="2">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-account-group" class="mr-2" color="primary"></v-icon>
          {{ $t('user.list.title') }}
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            density="compact"
            :label="$t('user.list.search')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            class="mr-4"
            style="max-width: 300px;"
            @update:model-value="fetchUsers"
          ></v-text-field>

          <v-btn icon="mdi-refresh" variant="text" class="mr-2" @click="fetchUsers"></v-btn>

          <UserCreate v-if="store.user.isSuperAdmin" @after-create="fetchUsers">
            <v-btn color="primary" prepend-icon="mdi-plus" variant="flat">
              {{ $t('user.list.create') }}
            </v-btn>
          </UserCreate>
        </v-card-title>

        <v-divider></v-divider>

        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          hover
        >
          <template #[`item.avatar`]="{ item }">
            <UserAvatar :user-id="item.id" :user-name="item.name" size="32" />
          </template>

          <template #[`item.isSuperAdmin`]="{ item }">
            <v-chip
              :color="item.isSuperAdmin ? 'primary' : 'default'"
              size="small"
              variant="flat"
            >
              {{ item.isSuperAdmin ? $t('user.list.role.superAdmin') : $t('user.list.role.user') }}
            </v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <SetSuperAdmin v-if="store.user.isSuperAdmin && item.id !== store.user.id" :user="item" @after="fetchUsers">
              <v-btn
                size="small"
                :variant="item.isSuperAdmin ? 'outlined' : 'tonal'"
                :color="item.isSuperAdmin ? 'warning' : 'primary'"
                :prepend-icon="item.isSuperAdmin ? 'mdi-shield-off' : 'mdi-shield-account'"
              >
                {{ item.isSuperAdmin ? $t('user.list.actions.removeSuperAdmin') : $t('user.list.actions.setSuperAdmin') }}
              </v-btn>
            </SetSuperAdmin>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserCreate from '@/components/user/UserCreate.vue'
import SetSuperAdmin from '@/components/SetSuperAdmin.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { ref, onMounted, computed } from 'vue'
import { getGetUsers } from '@/apis/user'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'

const store = useAppStore()
const { t } = useI18n()

const search = ref('')
const users = ref([])
const loading = ref(false)

const headers = computed(() => [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: t('user.list.headers.name'), key: 'name' },
  { title: t('user.list.headers.email'), key: 'email' },
  { title: t('user.list.headers.role'), key: 'isSuperAdmin' },
  { title: t('user.list.headers.actions'), key: 'actions', sortable: false, align: 'end' },
])

function fetchUsers() {
  loading.value = true
  getGetUsers({
    page: 1,
    size: 999,
    keyword: search.value,
  }).then((res) => {
    if (res.status === 200) {
      users.value = res.data.items
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

onMounted(() => {
  fetchUsers()
})
</script>

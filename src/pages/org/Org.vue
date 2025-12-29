<template>
  <DefaultLayout>
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12" md="8">
          <div class="d-flex align-center mb-2">
            <v-avatar
              size="64"
              rounded="lg"
              color="primary"
              class="mr-4 elevation-2"
            >
              <span class="text-h4 font-weight-bold text-white">
                {{ (org.displayName || org.name || '').substring(0, 1).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold text-primary">{{ org.displayName || org.name }}</h1>
              <div class="text-subtitle-1 text-medium-emphasis">
                {{ org.name }}
              </div>
            </div>
          </div>
          <p class="text-body-1 mt-4">{{ org.description }}</p>
        </v-col>
        <v-col cols="12" md="4" class="text-md-right">
          <OrgEdit :org-id="orgId" @after-update="getOrg">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-pencil"
              class="mr-2"
            >
              {{ $t('org.detail.edit') }}
            </v-btn>
          </OrgEdit>

          <OrgDelete :org-id="orgId" @after-delete="onAfterDelete">
            <v-btn
              variant="outlined"
              color="error"
              prepend-icon="mdi-delete"
            >
              {{ $t('org.detail.delete') }}
            </v-btn>
          </OrgDelete>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <!-- Tabs Section -->
      <v-tabs v-model="tab" color="primary" class="mb-6">
        <v-tab value="members">{{ $t('org.detail.tabs.members') }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="overflow: visible;">
        <!-- Members Tab -->
        <v-window-item value="members">
          <v-card variant="outlined" class="border-0">
            <v-row class="mb-4">
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <OrgMemberAdd :org-id="orgId" @after-add="fetchMembers">
                  <v-btn color="primary" prepend-icon="mdi-plus">
                    {{ $t('org.member.add.title') }}
                  </v-btn>
                </OrgMemberAdd>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="members"
              :loading="loading"
              hover
            >
              <template #[`item.avatar`]="{ item }">
                <UserAvatar :user-id="item.member.id" :user-name="item.member.name" size="32" />
              </template>

              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="item.isAdmin ? 'primary' : 'default'"
                  size="small"
                  variant="flat"
                >
                  {{ item.isAdmin ? $t('org.detail.members.admin') : $t('org.detail.members.member') }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <div v-if="item.member.name !== org.createdBy" class="d-flex justify-end">
                  <SetOrgAdmin :org-id="orgId" :member="item" @after="fetchMembers">
                    <v-btn
                      size="small"
                      variant="text"
                      :color="item.isAdmin ? 'warning' : 'primary'"
                      class="mr-1"
                      :title="item.isAdmin ? $t('org.detail.members.removeAdmin') : $t('org.detail.members.setAdmin')"
                      :icon="item.isAdmin ? 'mdi-shield-off' : 'mdi-shield-account'"
                    ></v-btn>
                  </SetOrgAdmin>

                  <OrgMemberDelete :org-id="orgId" :member="item" @after="fetchMembers">
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      icon="mdi-delete"
                      :title="$t('org.detail.members.remove')"
                    ></v-btn>
                  </OrgMemberDelete>
                </div>
                <div v-else>
                  <v-chip size="small" color="warning" variant="outlined">
                    {{ $t('org.detail.members.owner') }}
                  </v-chip>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import OrgEdit from '@/components/org/OrgEdit.vue'
import OrgDelete from '@/components/org/OrgDelete.vue'
import OrgMemberAdd from '@/components/org/OrgMemberAdd.vue'
import OrgMemberDelete from '@/components/org/OrgMemberDelete.vue'
import SetOrgAdmin from '@/components/org/SetOrgAdmin.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { ref, onMounted, computed } from 'vue'
import { getGetOrgMembers, getGetOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const orgId = route.params.orgId
const org = ref({})
const members = ref([])
const loading = ref(false)
const tab = ref('members')

const headers = computed(() => [
  { title: '', key: 'avatar', sortable: false, width: '50px' },
  { title: t('org.detail.members.name'), key: 'member.name' },
  { title: t('org.detail.members.role'), key: 'role' },
  { title: t('org.detail.members.actions'), key: 'actions', sortable: false, align: 'end' },
])

function fetchMembers() {
  loading.value = true
  getGetOrgMembers(orgId).then((res) => {
    if (res.status === 200) {
      members.value = res.data.items
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

function getOrg() {
  getGetOrg(orgId).then((res) => {
    if (res.status === 200) {
      org.value = res.data.item
      // Update store if needed, but relying on local state is safer for this page
      if (store.org.id === orgId) {
        store.setOrg(res.data.item)
      }
    }
  })
}

function onAfterDelete() {
  router.push({ name: 'Orgs' })
}

onMounted(() => {
  getOrg()
  fetchMembers()
})
</script>

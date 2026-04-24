<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-avatar
          size="32"
          rounded="md"
          :color="uuidToColor(orgId)"
          class="mr-3"
        >
          <span class="text-caption font-weight-bold text-white">
            {{ (org.displayName || org.name || '?').substring(0, 1).toUpperCase() }}
          </span>
        </v-avatar>
        <div class="d-flex flex-column" style="line-height: 1.2; min-width: 0;">
          <span class="ado-subheader__title text-truncate">
            {{ org.displayName || org.name || 'Organization' }}
          </span>
          <span class="text-caption text-medium-emphasis text-truncate">
            {{ org.name }}
          </span>
        </div>
        <v-spacer />
        <div class="d-flex align-center" style="gap: 4px;">
          <v-btn
            prepend-icon="mdi-folder-multiple-outline"
            variant="text"
            size="small"
            :to="`/orgs/${orgId}/projects`"
          >
            Projects
          </v-btn>
          <OrgEdit :org-id="orgId" @after-update="getOrg">
            <v-btn variant="text" size="small" prepend-icon="mdi-pencil-outline">
              {{ $t('org.detail.edit') }}
            </v-btn>
          </OrgEdit>
          <OrgDelete :org-id="orgId" @after-delete="onAfterDelete">
            <v-btn variant="text" size="small" color="error" prepend-icon="mdi-delete-outline">
              {{ $t('org.detail.delete') }}
            </v-btn>
          </OrgDelete>
        </div>
      </div>

      <div class="ado-subheader" style="padding: 0 8px;">
        <v-tabs v-model="tab" height="40" color="primary" density="compact">
          <v-tab value="members">
            <template #prepend><v-icon size="small">mdi-account-group-outline</v-icon></template>
            {{ $t('org.detail.tabs.members') }}
          </v-tab>
        </v-tabs>
      </div>
    </template>

    <div class="pa-4">
      <p v-if="org.description" class="text-body-2 text-medium-emphasis mb-3">
        {{ org.description }}
      </p>

      <v-window v-model="tab" style="overflow: visible;">
        <!-- Members Tab -->
        <v-window-item value="members">
          <v-card flat class="ado-border" rounded="md">
            <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b" style="gap: 8px;">
              <v-icon size="small" color="primary">mdi-account-group-outline</v-icon>
              <span class="text-subtitle-2 font-weight-bold">{{ $t('org.detail.tabs.members') }}</span>
              <v-chip size="x-small" variant="tonal">{{ members.length }}</v-chip>
              <v-spacer />
              <v-text-field
                v-model="search"
                density="compact"
                :placeholder="$t('user.list.search')"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
                clearable
                style="max-width: 240px;"
              />
              <v-btn icon="mdi-refresh" variant="text" size="small" density="comfortable" @click="fetchMembers" />
              <OrgMemberAdd :org-id="orgId" @after-add="fetchMembers">
                <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" size="small">
                  {{ $t('org.member.add.title') }}
                </v-btn>
              </OrgMemberAdd>
            </div>

            <v-data-table
              :headers="headers"
              :items="members"
              :loading="loading"
              :search="search"
              hover
              density="compact"
            >
              <template #[`item.avatar`]="{ item }">
                <UserAvatar :user-id="item.member.id" :user-name="item.member.name" size="28" />
              </template>

              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="item.isAdmin ? 'primary' : undefined"
                  size="x-small"
                  variant="tonal"
                >
                  {{ item.isAdmin ? $t('org.detail.members.admin') : $t('org.detail.members.member') }}
                </v-chip>
              </template>

              <template #[`item.actions`]="{ item }">
                <div v-if="item.member.name !== org.createdBy" class="d-flex align-center justify-end" style="gap: 4px;">
                  <SetOrgAdmin :org-id="orgId" :member="item" @after="fetchMembers">
                    <v-btn
                      size="small"
                      variant="text"
                      :color="item.isAdmin ? 'warning' : 'primary'"
                      :prepend-icon="item.isAdmin ? 'mdi-shield-off-outline' : 'mdi-shield-account-outline'"
                    >
                      {{ item.isAdmin ? $t('org.detail.members.removeAdmin') : $t('org.detail.members.setAdmin') }}
                    </v-btn>
                  </SetOrgAdmin>
                  <OrgMemberDelete :org-id="orgId" :member="item" @after="fetchMembers">
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      icon="mdi-delete-outline"
                      density="comfortable"
                      :title="$t('org.detail.members.remove')"
                    />
                  </OrgMemberDelete>
                </div>
                <div v-else>
                  <v-chip size="x-small" color="warning" variant="tonal">
                    {{ $t('org.detail.members.owner') }}
                  </v-chip>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
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
import { uuidToColor } from '@/utils/utils'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const orgId = route.params.orgId
const org = ref({})
const members = ref([])
const loading = ref(false)
const tab = ref('members')
const search = ref('')

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

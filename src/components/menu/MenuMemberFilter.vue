<template>
  <v-menu v-model="menuOpen" location="bottom end">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-account-filter-outline"
        append-icon="mdi-chevron-down"
        variant="text"
        size="small"
      >
        {{ member.userName }}
      </v-btn>
    </template>
    <v-card class="ado-panel" rounded="sm" min-width="240">
      <v-list density="compact">
        <v-list-subheader>Filter by assignee</v-list-subheader>
        <v-list-item :active="member.userId === 'all'" @click="setMember('all', 'All members')">
          <template #prepend><v-icon size="small">mdi-account-multiple-outline</v-icon></template>
          <v-list-item-title>All members</v-list-item-title>
          <template v-if="member.userId === 'all'" #append><v-icon color="primary" size="small">mdi-check</v-icon></template>
        </v-list-item>
        <v-list-item :active="member.userId === store.user.id" @click="setMember(store.user.id, '@Me')">
          <template #prepend><UserAvatar :user-id="store.user.id" :user-name="store.user.name" size="22" /></template>
          <v-list-item-title>@Me</v-list-item-title>
          <template v-if="member.userId === store.user.id" #append><v-icon color="primary" size="small">mdi-check</v-icon></template>
        </v-list-item>
        <v-divider class="my-1" />
        <div v-if="loading" class="ado-member-loading">
          <v-progress-circular indeterminate color="primary" size="20" width="2" />
          <span>Loading members...</span>
        </div>
        <div v-else-if="!ready" class="ado-member-pending" aria-hidden="true"></div>
        <v-list-item v-else-if="sprint.members.length === 0" disabled title="No sprint members" />
        <template v-else>
          <v-list-item
            v-for="item in sprint.members"
            :key="item.userId"
            :title="item.userName"
            :active="member.userId === item.userId"
            @click="setMember(item.userId, item.userName)"
          >
            <template #prepend><UserAvatar :user-id="item.userId" :user-name="item.userName" size="22" /></template>
            <template v-if="member.userId === item.userId" #append><v-icon color="primary" size="small">mdi-check</v-icon></template>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getGetSprint } from '@/apis/sprint'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const emit = defineEmits(['afterSetMember'])

const store = useAppStore()
const route = useRoute()

const sprint = ref({ members: [] })
const menuOpen = ref(false)
const {
  loading,
  ready,
  reset: resetLoading,
  run: runLoading
} = useDelayedLoading()
const member = ref({
  userId: 'all',
  userName: 'All members'
})

function setMember(userId, userName) {
  member.value.userId = userId
  member.value.userName = userName
  menuOpen.value = false
  emit('afterSetMember', userId)
}

function loadSprint() {
  if (!route.params.sprintId) return
  resetLoading()
  sprint.value = { members: [] }
  void runLoading(async () => {
    const res = await getGetSprint(route.params.orgId, route.params.projectId, route.params.sprintId)
    if (res.status === 200) {
      sprint.value = res.data.item
    }
  }).catch(() => {})
}

onMounted(loadSprint)
watch(() => route.params.sprintId, loadSprint)
</script>

<style scoped>
.ado-member-loading,
.ado-member-pending {
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  color: var(--ado-text-secondary);
  font-size: 12px;
}
</style>


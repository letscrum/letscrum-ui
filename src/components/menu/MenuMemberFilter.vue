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

const emit = defineEmits(['afterSetMember'])

const store = useAppStore()
const route = useRoute()

const sprint = ref({ members: [] })
const menuOpen = ref(false)
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
  getGetSprint(route.params.orgId, route.params.projectId, route.params.sprintId).then(res => {
    if (res.status === 200) {
      sprint.value = res.data.item
    }
  })
}

onMounted(loadSprint)
watch(() => route.params.sprintId, loadSprint)
</script>


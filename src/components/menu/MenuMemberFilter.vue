<template>
  <v-menu location="bottom end" offset="4">
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
    <v-card class="ado-border" rounded="md">
      <v-list density="compact" min-width="200">
        <v-list-item @click="setMember('all', 'All')">
          <template #prepend><v-icon size="small">mdi-account-multiple-outline</v-icon></template>
          <v-list-item-title>All members</v-list-item-title>
        </v-list-item>
        <v-list-item @click="setMember(store.user.id, '@Me')">
          <template #prepend><v-icon size="small">mdi-account-outline</v-icon></template>
          <v-list-item-title>@Me</v-list-item-title>
        </v-list-item>
        <v-divider class="my-1" />
        <v-list-item
          v-for="(item, i) in sprint.members"
          :key="i"
          :title="item.userName"
          @click="setMember(item.userId, item.userName)"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getGetSprint } from '@/apis/sprint'

const emit = defineEmits(['afterSetMember'])

const store = useAppStore()
const route = useRoute()

const sprint = ref({ members: [] })
const member = ref({
  userId: 0,
  userName: 'All members'
})

function setMember(userId, userName) {
  member.value.userId = userId
  member.value.userName = userName
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


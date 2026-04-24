<template>
  <v-menu location="bottom end" :close-on-content-click="false" offset="4">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-account-plus-outline"
        variant="tonal"
        color="primary"
        size="small"
      >
        Add Member
      </v-btn>
    </template>
    <v-card class="ado-border pa-3" rounded="md" min-width="320">
      <div class="text-overline text-medium-emphasis mb-2">Add sprint member</div>
      <v-autocomplete
        v-model:search-input="search"
        v-model="addMembers"
        :items="users"
        item-title="userName"
        item-value="userId"
        density="compact"
        variant="outlined"
        hide-details
        label="Search project member"
        no-filter
        @update:search="searchUsers"
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :title="item.raw.userName" />
        </template>
      </v-autocomplete>
      <div class="d-flex mt-3">
        <v-spacer />
        <v-btn color="primary" variant="flat" size="small" @click="onAddSprintMember">
          Add
        </v-btn>
      </div>
    </v-card>
  </v-menu>

  <v-btn prepend-icon="mdi-content-save-outline" variant="text" size="small" @click="onSave">
    Save
  </v-btn>
  <v-btn prepend-icon="mdi-undo-variant" variant="text" size="small" @click="onUndo">
    Undo
  </v-btn>
  <v-menu location="bottom end" offset="4">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="small" density="comfortable" />
    </template>
    <v-card class="ado-border" rounded="md">
      <v-list density="compact" min-width="220">
        <v-list-item @click="onAddFromProject">
          <template #prepend><v-icon size="small">mdi-account-multiple-plus-outline</v-icon></template>
          <v-list-item-title>Add all project members</v-list-item-title>
        </v-list-item>
        <v-list-item disabled>
          <template #prepend><v-icon size="small">mdi-content-copy</v-icon></template>
          <v-list-item-title>Copy from last sprint</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGetProject } from '@/apis/project';
import { postAddSprintMember } from '@/apis/sprint';
import { useRoute } from 'vue-router';
const emit = defineEmits(['afterAdd', 'afterAddFromProject', 'afterSave', 'afterUndo'])

const route = useRoute()

const users = ref([])
const search = ref('')
const addMembers = ref(null)
const allUsers = ref([])

function customFilter(itemTitle, queryText) {
  if (!queryText) return true
  return (itemTitle || '').toLowerCase().includes(queryText.toLowerCase())
}

function onAddSprintMember() {
  if (!addMembers.value) return
  const target = allUsers.value.find(u => u.userId === addMembers.value)
  if (!target) return
  postAddSprintMember(
    route.params.orgId,
    route.params.projectId,
    route.params.sprintId,
    {
      member: {
        userId: target.userId,
        userName: target.userName,
        capacity: 0,
        role: 'Unassigned',
      }
    },
  ).then(res => {
    if (res.status === 200) {
      addMembers.value = null
      emit('afterAdd')
    }
  })
}

function onAddFromProject() {
  emit('afterAddFromProject')
}

function onSave() {
  emit('afterSave')
}

function onUndo() {
  emit('afterUndo')
}

onMounted(() => {
  getGetProject(
    route.params.orgId,
    route.params.projectId,
  ).then(res => {
    if (res.status === 200) {
      allUsers.value = res.data.item.members
    }
  })
})</script>

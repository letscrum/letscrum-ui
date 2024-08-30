<template>
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn style="margin-top: 6px;" v-bind="props" prepend-icon="mdi-plus" variant="text">
        Add Member
      </v-btn>
    </template>
    <v-list density="compact">
      <v-autocomplete
        v-model:search-input="search"
        v-model="addMembers"
        chips
        :items="users"
        label="Autocomplete"
        item-props
        no-filter
        @update:search="searchUsers"
      >
        <template #chip="{ props, item }">
          <v-chip
          closable
          v-bind="props"
            :text="item.raw.userName"
          ></v-chip>

        </template>
        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.raw.userName"
          ></v-list-item>
        </template>
      </v-autocomplete>

      <v-btn @click="onAddSprintMember">
        Add
      </v-btn>
    </v-list>
  </v-menu>

  <v-btn style="margin-top: 6px;" prepend-icon="mdi-content-save" variant="text" @click="onSave">
    Save
  </v-btn>
  <v-btn style="margin-top: 6px;" prepend-icon="mdi-undo-variant" variant="text" @click="onUndo">
    Undo
  </v-btn>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn style="margin-top: 6px;" v-bind="props" density="comfortable" icon="mdi-dots-horizontal" variant="text">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item @click="onAddFromProject">
        <v-list-item-title>Add all project members</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Copy from last sprint</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-spacer></v-spacer>
</template>

<script setup>
import { getGetProject } from '@/apis/project';
import { postAddSprintMember } from '@/apis/sprint';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const emit = defineEmits(['afterAdd', 'afterAddFromProject', 'afterSave', 'afterUndo'])

const route = useRoute()

const users = ref([])
const search = ref('')
const addMembers = ref([])

const searchUsers = val => {
  if (!val) {
    return false
  }
  // get users from users.value
  console.log('users', users.value)
  users.value = users.value.filter((item) => {
    return item.userName.includes(val)
  })
  console.log('users after', users.value)
}

function onAddSprintMember() {
  console.log('add', addMembers.value)
  postAddSprintMember(
    route.params.orgId,
    route.params.projectId,
    route.params.sprintId,
    {
      member: {
        userId: addMembers.value.userId,
        userName: addMembers.value.userName,
        capacity: 0,
        role: 'Unassigned',
      }
    },
  ).then(res => {
    if (res.status === 200) {
      console.log('added')
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
      users.value = res.data.item.members
    }
  })
})

</script>

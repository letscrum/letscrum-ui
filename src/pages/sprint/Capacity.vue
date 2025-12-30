<template>
  <v-container fluid class="pa-4">
    <v-card class="elevation-1">
      <v-card-title class="text-h6 font-weight-bold pa-4">
        Sprint Capacity Planning
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <v-table hover>
          <thead>
            <tr class="bg-grey-lighten-4">
              <th class="text-center" style="width: 80px">Avatar</th>
              <th class="text-left">Name</th>
              <th class="text-left" style="width: 250px">Role</th>
              <th class="text-left" style="width: 150px">Capacity (Hrs)</th>
              <th class="text-center" style="width: 80px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentMembers" :key="item.userId">
              <td class="text-center py-2">
                <user-avatar :user-id="item.userId" :user-name="item.userName"></user-avatar>
              </td>
              <td class="font-weight-medium">{{ item.userName }}</td>
              <td class="py-2">
                <v-select
                  v-model="item.role"
                  :items="['Unassigned', 'Development', 'Designer', 'Testing']"
                  variant="outlined"
                  density="compact"
                  hide-details
                  bg-color="white"
                ></v-select>
              </td>
              <td class="py-2">
                <v-text-field
                  v-model.number="item.capacity"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  bg-color="white"
                  min="0"
                ></v-text-field>
              </td>
              <td class="text-center">
                <SprintMemberDelete :member="item" @after="LoadSprint">
                  <v-btn icon="mdi-delete" color="error" variant="text" size="small"></v-btn>
                </SprintMemberDelete>
              </td>
            </tr>
            <tr v-if="currentMembers.length === 0">
              <td colspan="5" class="text-center py-4 text-grey">
                No members in this sprint. Add members from the menu.
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprint, putUpdateSprintMembers } from '@/apis/sprint'
import { getGetProject } from '@/apis/project';
import { useAppStore } from '@/stores/app';

const emit = defineEmits(['task-changed'])

const route = useRoute()
const sprint = ref({})
const members = ref([])
const currentMembers = ref([])
const store = useAppStore()

function LoadSprint() {
  getGetSprint(route.params.orgId, route.params.projectId, route.params.sprintId).then((res) => {
    if (res.status === 200) {
      sprint.value = res.data.item
      members.value = res.data.item.members
      currentMembers.value = res.data.item.members
    }
  })
}

function addAllMembersFromProject() {
  getGetProject(route.params.orgId, route.params.projectId).then((res) => {
    if (res.status === 200) {
      const project = res.data.item
      for (let i = 0; i < project.members.length; i++) {
        const member = project.members[i]
        if (members.value.find((item) => item.userId == member.userId)) {
          continue
        }
        let sprintMember = {
          userId: member.userId,
          userName: member.userName,
          role: 'Unassigned',
          capacity: 0,
        }
        members.value.push(sprintMember)
      }
      console.log(members.value)

      putUpdateSprintMembers(route.params.orgId, route.params.projectId, route.params.sprintId, {
        members: members.value
      }).then((res) => {
        if (res.status === 200) {
          LoadSprint()
        }
      })
    }
  })
}


defineExpose({
  reloadSprint,
  addAllMembersFromProject,
  saveMembers,
  undoMembers,
  showSide,
})

function showSide(type) {
  store.setSidebar(type)
}

function reloadSprint() {
  LoadSprint()
}

function saveMembers() {
  putUpdateSprintMembers(route.params.orgId, route.params.projectId, route.params.sprintId, {
    members: currentMembers.value
  }).then((res) => {
    if (res.status === 200) {
      LoadSprint()
    }
  })
}

function undoMembers() {
  console.log('undo', currentMembers.value)
  console.log('undo', members.value)

  currentMembers.value = members.value
}

onMounted(() => {
  LoadSprint()
  emit('task-changed')
})
</script>

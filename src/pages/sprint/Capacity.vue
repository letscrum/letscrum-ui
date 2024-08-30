<template>
  <div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">
          </th>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Role
          </th>
          <th class="text-left">
            Capacity
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in currentMembers"
          :key="item.userId"
        >
          <td>
            <user-avatar :user-id="item.userId" :user-name="item.userName"></user-avatar>
          </td>
          <td>{{ item.userName }}</td>
          <td>
            <select v-model="item.role">
              <option value="Unassigned">Unassigned</option>
              <option value="Development">Development</option>
              <option value="Designer">Designer</option>
              <option value="Testing">Testing</option>
            </select>
          </td>
          <td>
            <input v-model="item.capacity" />
          </td>
          <td>
            <SprintMemberDelete :member="item" @after="LoadSprint">
              <v-btn>
                X
              </v-btn>
            </SprintMemberDelete>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprint, putUpdateSprintMembers } from '@/apis/sprint'
import { getGetProject } from '@/apis/project';
import { useAppStore } from '@/stores/app';

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
  store.setTaskboardSidebar(type)
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
})
</script>

<template>
  <div>
    <v-btn tile text small style="margin-top: 10px;" @click="AddAllMembers">
      <v-icon left>
        mdi-plus
      </v-icon>
      Add All Members
    </v-btn>
    <v-table>
      <thead>
        <tr>
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
          v-for="item in members"
          :key="item.userId"
        >
          <td>{{ item.userName }}</td>
          <td>{{ item.role }}</td>
          <td>{{ item.capacity }}</td>
          <td><v-btn @click="onRemoveSprintMember(item.userId)">X</v-btn></td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprint, putUpdateSprintMembers, deleteRemoveSprintMember } from '@/apis/sprint'
import { getGetProject } from '@/apis/project';


const route = useRoute()
const sprint = ref({})
const members = ref([])

function LoadSprint() {
  getGetSprint(route.params.orgId, route.params.projectId, route.params.sprintId).then((res) => {
    if (res.status === 200) {
      sprint.value = res.data.item
      members.value = res.data.item.members
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
})

function reloadSprint() {
  LoadSprint()
}

function onRemoveSprintMember(userId) {
  deleteRemoveSprintMember(
    route.params.orgId,
    route.params.projectId,
    route.params.sprintId,
    userId,
  ).then((res) => {
    if (res.status === 200) {
      LoadSprint()
    }
  })
}

onMounted(() => {
  LoadSprint()
})
</script>

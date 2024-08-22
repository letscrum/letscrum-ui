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

function AddAllMembers() {
  getGetProject(route.params.orgId, route.params.projectId).then((res) => {
    if (res.status === 200) {
      const project = res.data.item
      for (let i = 0; i < project.members.length; i++) {
        const member = project.members[i]
        if (members.value.find((item) => item.userId === member.userId)) {
          continue
        }
        members.value.push(member)
      }
      console.log(members.value)

      let sprintMembers = members.value.map((item) => {
        return {
          userId: item.userId,
          userName: item.userName,
          Capacity: 0
        }
      })

      putUpdateSprintMembers(route.params.orgId, route.params.projectId, route.params.sprintId, {
        members: sprintMembers
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

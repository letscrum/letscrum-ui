<template>
  <div>
    <v-btn tile text small style="margin-top: 10px;" @click="AddAllMembers">
      <v-icon left>
        mdi-plus
      </v-icon>
      Add All Members
    </v-btn>
    <v-data-table
      :items="members"
    >
    </v-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprint, putUpdateSprintMembers } from '@/apis/sprint'
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

onMounted(() => {
  LoadSprint()
})
</script>

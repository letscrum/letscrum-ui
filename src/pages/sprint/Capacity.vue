<template>
  <v-card flat class="ado-border" rounded="md">
    <div class="d-flex align-center px-4 py-2 ado-header-bg ado-border-b">
      <v-icon class="mr-2" color="primary" size="small">mdi-chart-timeline-variant</v-icon>
      <span class="text-subtitle-2 font-weight-bold">Sprint Capacity Planning</span>
      <v-spacer />
      <v-chip v-if="totalCapacity > 0" size="x-small" variant="tonal" color="primary" class="mr-2">
        Total: {{ totalCapacity }}h
      </v-chip>
      <v-chip size="x-small" variant="tonal">
        {{ currentMembers.length }} member{{ currentMembers.length !== 1 ? 's' : '' }}
      </v-chip>
    </div>
    <v-table density="compact" hover>
      <thead>
        <tr>
          <th style="width: 56px;"></th>
          <th class="text-left">Name</th>
          <th class="text-left" style="width: 220px;">Role / Activity</th>
          <th class="text-left" style="width: 160px;">Capacity (Hrs)</th>
          <th class="text-center" style="width: 64px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in currentMembers" :key="item.userId">
          <td class="text-center">
            <user-avatar :user-id="item.userId" :user-name="item.userName" size="28"></user-avatar>
          </td>
          <td class="font-weight-medium">{{ item.userName }}</td>
          <td>
            <v-select
              v-model="item.role"
              :items="['Unassigned', 'Development', 'Designer', 'Testing']"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </td>
          <td>
            <v-text-field
              v-model.number="item.capacity"
              type="number"
              variant="outlined"
              density="compact"
              hide-details
              min="0"
              suffix="h"
            ></v-text-field>
          </td>
          <td class="text-center">
            <SprintMemberDelete :member="item" @after="LoadSprint">
              <v-btn icon="mdi-delete-outline" color="error" variant="text" size="small" density="comfortable"></v-btn>
            </SprintMemberDelete>
          </td>
        </tr>
        <tr v-if="currentMembers.length === 0">
          <td colspan="5" class="text-center py-8 text-medium-emphasis">
            <v-icon size="40" class="mb-2">mdi-account-multiple-outline</v-icon>
            <div class="text-body-2">No members in this sprint.</div>
            <div class="text-caption">Use "Add Member" or "Add all project members" from the toolbar.</div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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

const totalCapacity = computed(() =>
  currentMembers.value.reduce((sum, m) => sum + (Number(m.capacity) || 0), 0)
)

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
  currentMembers.value = members.value
}

onMounted(() => {
  LoadSprint()
  emit('task-changed')
})
</script>

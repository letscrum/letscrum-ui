<template>
  <DefaultLayout>
    <template #subheader>
      <!-- Sprint sub-header: title + iteration meta + actions -->
      <div class="ado-subheader d-flex align-center flex-wrap" style="height: auto; min-height: 56px; padding: 8px 16px; gap: 8px;">
        <div class="d-flex align-center flex-grow-1" style="min-width: 0;">
          <v-icon class="mr-2" color="primary">mdi-run-fast</v-icon>
          <div class="d-flex flex-column" style="min-width: 0;">
            <div class="d-flex align-center" style="min-width: 0;">
              <span class="ado-subheader__title text-truncate">{{ store.sprint.name || 'Sprint' }}</span>
              <v-chip
                v-if="sprintRangeText"
                size="x-small"
                variant="tonal"
                color="grey"
                class="ml-2"
              >
                {{ sprintRangeText }}
              </v-chip>
              <v-chip
                v-if="daysRemaining !== null"
                size="x-small"
                variant="tonal"
                :color="daysRemaining <= 2 ? 'error' : 'primary'"
                class="ml-2"
              >
                {{ daysRemainingText }}
              </v-chip>
            </div>
          </div>
        </div>

        <!-- Sprint switcher + burndown + page-specific menu -->
        <div class="d-flex align-center" style="gap: 8px;">
          <!-- Burndown chart (moved here from tabs row) -->
          <div class="d-none d-lg-flex align-center" style="gap: 6px;">
            <span class="text-caption text-medium-emphasis">Burndown</span>
            <SprintBurndown :burndown-data="burndown" />
          </div>
          <v-divider vertical class="d-none d-lg-flex" style="height: 24px; align-self: center;" />
          <router-view
            name="sprintMenu"
            @after-set-sprint="onSetSprint"
            @after-load-sprints="onLoadSprints"
            @after-show-side="onShowSide"
          />
        </div>
      </div>

      <!-- Tabs row -->
      <div class="ado-subheader d-flex align-center" style="padding: 0 8px;">
        <v-tabs
          height="40"
          color="primary"
          slider-color="primary"
          density="compact"
        >
          <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id" exact>
            <template #prepend><v-icon size="small">mdi-view-column-outline</v-icon></template>
            Taskboard
          </v-tab>
          <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id + '/backlog'">
            <template #prepend><v-icon size="small">mdi-format-list-bulleted</v-icon></template>
            Backlog
          </v-tab>
          <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id + '/capacity'">
            <template #prepend><v-icon size="small">mdi-chart-timeline-variant</v-icon></template>
            Capacity
          </v-tab>
          <v-tab disabled>
            <template #prepend><v-icon size="small">mdi-chart-line</v-icon></template>
            Analytics
          </v-tab>
        </v-tabs>

        <v-spacer />

        <!-- Page-specific action area -->
        <div class="d-flex align-center" style="gap: 8px;">
          <!-- Taskboard member filter (moved here from sprint switcher row) -->
          <MenuMemberFilter
            v-if="route.name === 'SprintTaskboard'"
            @after-set-member="onSetMember"
          />
          <router-view
            v-if="route.name == 'SprintTaskboard'"
            name="menu"
            @create-work-item="onCreateWorkItem"
          />
          <router-view
            v-if="route.name == 'SprintBacklog'"
            name="menu"
            @after-create="onCreateWorkItemFromBacklog"
          />
          <router-view
            v-if="route.name == 'SprintCapacity'"
            name="menu"
            @after-add="onReLoadSprint"
            @after-add-from-project="onAddFromProject"
            @after-save="onSave"
            @after-undo="onUndo"
          />
        </div>
      </div>
    </template>

    <div class="pa-3">
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="mainContent" :sprints="sprints" @task-changed="onLoadBurndown" />
      </router-view>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SprintBurndown from '@/components/sprint/SprintBurndown.vue'
import MenuMemberFilter from '@/components/menu/MenuMemberFilter.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getSprintTaskBurndown, getSprintWorkBurnDown } from '@/apis/sprint';
import { onMounted, ref, computed } from 'vue';

const store = useAppStore()

const route = useRoute()
const sprints = ref([])
const burndown = ref({
  labels: [],
  values: [],
})


const mainContent = ref()

const sprintRangeText = computed(() => {
  if (!store.sprint.startDate || !store.sprint.endDate) return ''
  const start = new Date(Number(store.sprint.startDate) * 1000)
  const end = new Date(Number(store.sprint.endDate) * 1000)
  const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(start)} – ${fmt(end)}`
})

const daysRemaining = computed(() => {
  if (!store.sprint.endDate) return null
  const end = new Date(Number(store.sprint.endDate) * 1000)
  const now = new Date()
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff
})

const daysRemainingText = computed(() => {
  const d = daysRemaining.value
  if (d === null) return ''
  if (d < 0) return 'Ended'
  if (d === 0) return 'Last day'
  if (d === 1) return '1 day left'
  return `${d} days left`
})

function onCreateWorkItem(workItemType) {
  mainContent.value.AddWorkItem(workItemType)
}

function onCreateWorkItemFromBacklog() {
  mainContent.value.LoadWorkItems()
}

function onShowSide(type) {
  mainContent.value.showSide(type)
}

function onReLoadSprint() {
  mainContent.value.reloadSprint()
  onLoadBurndown()
}

function onAddFromProject() {
  mainContent.value.addAllMembersFromProject()
}

function onSave() {
  mainContent.value.saveMembers()
}

function onUndo() {
  mainContent.value.undoMembers()
}

function onSetSprint() {
  mainContent.value.LoadWorkItems()
  onLoadBurndown()
}

function onSetMember(memberId) {
  mainContent.value.filterTasks(memberId)
}

function onLoadSprints(getSprints) {
  sprints.value = getSprints
}

function onLoadBurndown() {
  if (!store.sprint.id) return
  if (store.sprint.burndownType == 'ByHour') {
    getSprintWorkBurnDown(route.params.orgId, route.params.projectId, store.sprint.id).then((res) => {
      burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))
      burndown.value.values = res.data.burndown.map((item) => item.actual)
    })
  } else {
    getSprintTaskBurndown(route.params.orgId, route.params.projectId, store.sprint.id).then((res) => {
      burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))
      burndown.value.values = res.data.burndown.map((item) => item.actual)
    })
  }
}

onMounted(() => {
  onLoadBurndown()
})

</script>

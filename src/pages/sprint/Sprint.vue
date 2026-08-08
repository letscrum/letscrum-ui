<template>
  <DefaultLayout>
    <template #subheader>
      <!-- Sprint sub-header: title + iteration meta + actions -->
      <div class="ado-subheader ado-sprint-header">
        <div class="ado-sprint-header__identity d-flex align-center flex-grow-1">
          <v-icon class="mr-2" color="primary">mdi-run-fast</v-icon>
          <div class="d-flex flex-column" style="min-width: 0;">
            <div class="ado-sprint-header__meta d-flex align-center">
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
        <div class="ado-toolbar-actions ado-sprint-header__actions">
          <!-- Burndown chart (moved here from tabs row) -->
          <div class="d-none d-lg-flex align-center" style="gap: 6px;">
            <span class="text-caption text-medium-emphasis">Burndown</span>
            <SprintBurndown :burndown-data="burndown" :loading="burndownLoading" :ready="burndownReady" />
          </div>
          <v-divider vertical class="d-none d-lg-flex" style="height: 24px; align-self: center;" />
          <router-view
            name="sprintMenu"
            @after-set-sprint="onSetSprint"
            @after-load-sprints="onLoadSprints"
            @after-show-side="onShowSide"
            @loading-change="sprintsLoading = $event"
            @ready-change="sprintsReady = $event"
          />
        </div>
      </div>

      <!-- Tabs row -->
      <div class="ado-subheader ado-tabs-bar ado-tabs-bar--actions">
        <v-tabs
          class="ado-sprint-tabs"
          height="40"
          color="primary"
          slider-color="primary"
          density="compact"
          show-arrows
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
        </v-tabs>

        <v-spacer />

        <!-- Page-specific action area -->
        <div class="ado-toolbar-actions ado-tabs-bar__actions">
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

    <div class="ado-workspace">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          ref="mainContent"
          :sprints="sprints"
          :sprints-loading="sprintsLoading"
          :sprints-ready="sprintsReady"
          @task-changed="onLoadBurndown"
        />
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
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const store = useAppStore()

const route = useRoute()
const sprints = ref([])
const sprintsLoading = ref(false)
const sprintsReady = ref(false)
const burndown = ref({
  labels: [],
  values: [],
})
const {
  loading: burndownLoading,
  ready: burndownReady,
  run: runBurndownLoading
} = useDelayedLoading()


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
  void runBurndownLoading(async () => {
    const request = store.sprint.burndownType == 'ByHour'
      ? getSprintWorkBurnDown(route.params.orgId, route.params.projectId, store.sprint.id)
      : getSprintTaskBurndown(route.params.orgId, route.params.projectId, store.sprint.id)
    const res = await request
    burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))
    burndown.value.values = res.data.burndown.map((item) => item.actual)
  }).catch(() => {})
}

onMounted(() => {
  onLoadBurndown()
})

</script>

<style scoped>
.ado-sprint-header {
  min-height: 60px;
  padding-block: 8px;
  gap: 12px;
}
.ado-sprint-header__identity,
.ado-sprint-header__meta {
  min-width: 0;
}
.ado-sprint-header__actions {
  margin-left: auto;
}
.ado-sprint-tabs {
  min-width: 0;
  flex: 1 1 auto;
}
.ado-tabs-bar__actions {
  flex: 0 0 auto;
}
@media (max-width: 700px) {
  .ado-sprint-header__actions,
  .ado-tabs-bar__actions {
    width: 100%;
    margin-left: 0;
  }
  .ado-sprint-tabs {
    width: 100%;
  }
}
</style>

<template>
  <!-- Sprint switcher -->
  <v-menu v-model="menuOpen" location="bottom end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-run-fast"
        append-icon="mdi-chevron-down"
        variant="text"
        size="small"
      >
        {{ store.sprint.name || 'Select sprint' }}
      </v-btn>
    </template>
    <v-card class="ado-panel ado-sprint-menu" rounded="sm">
      <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b">
        <v-icon size="small" color="primary" class="mr-2">mdi-run-fast</v-icon>
        <span class="text-subtitle-2 font-weight-bold">Sprints</span>
        <v-spacer />
        <SprintCreate @after-create="LoadSprints()">
          <v-btn prepend-icon="mdi-plus" variant="text" size="x-small" color="primary">New</v-btn>
        </SprintCreate>
      </div>
      <v-virtual-scroll height="320" item-height="56" :items="sprints">
        <template #default="{ item }">
          <v-list-item
            :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
            lines="two"
            :active="item.id === store.sprint.id"
            :title="item.name"
            :subtitle="new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' – ' + new Date(item.endDate * 1000).toISOString().substring(0, 10)"
            @click="onSetSprint(item.id, item.name, item.startDate, item.endDate, item.burndownType)"
          >
            <template #prepend>
              <v-icon :color="item.id === store.sprint.id ? 'primary' : undefined" size="small">mdi-run-fast</v-icon>
            </template>
            <template #append>
              <div class="d-flex align-center" style="gap: 6px;">
              <v-chip
                size="x-small"
                :color="item.status === 'Current' ? 'primary' : (item.status === 'Future' ? 'info' : 'grey')"
                :variant="item.status === 'Current' ? 'flat' : 'tonal'"
              >
                {{ item.status }}
              </v-chip>
              <v-icon v-if="item.id === store.sprint.id" color="primary" size="small">mdi-check</v-icon>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>
  </v-menu>

  <!-- View options (shared) -->
  <MenuViewOptions @after-show-side="onShowSide" />
</template>

<script setup>
const emit = defineEmits(['afterSetSprint', 'afterLoadSprints', 'afterShowSide'])

import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'
import { getGetSprints } from '@/apis/sprint';
import MenuViewOptions from '@/components/menu/MenuViewOptions.vue';

const store = useAppStore()
const route = useRoute()

const sprints = ref([])
const menuOpen = ref(false)

function onSetSprint(id, name, startDate, endDate, burndownType) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate,
    burndownType: burndownType,
  })
  menuOpen.value = false
  emit('afterSetSprint')
}

onMounted(() => {
  LoadSprints()
})

function LoadSprints() {
  getGetSprints(store.org.id, route.params.projectId, {
    page: 1,
    size: 999
  }).then((res) => {
    if (res.status === 200) {
      sprints.value = res.data.items;
      emit('afterLoadSprints', sprints.value)
      if (store.sprint.id === 0) {
        const currentSprint = sprints.value.find((item) => item.status === 'Current')
        if (currentSprint) {
          store.setSprint({
            id: currentSprint.id,
            name: currentSprint.name,
            startDate: currentSprint.startDate,
            endDate: currentSprint.endDate,
            burndownType: currentSprint.burndownType,
          })
        }
      }
    }
  })
}

function onShowSide(type) {
  emit('afterShowSide', type)
}
</script>

<style scoped>
.ado-sprint-menu {
  width: min(420px, calc(100vw - 24px));
  min-width: min(380px, calc(100vw - 24px));
}
</style>

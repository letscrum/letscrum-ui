<template>
  <v-menu :close-on-content-click="false" location="bottom end" offset="8">
    <template #activator="{ props: activatorProps }">
      <v-sheet
        v-bind="activatorProps"
        max-width="160"
        width="160"
        height="32"
        class="cursor-pointer ado-border rounded-md px-2 d-flex align-center"
        rounded="md"
        :class="{ 'ado-empty-burndown': !hasData }"
      >
        <v-sparkline
          v-if="hasData"
          fill
          :gradient="['rgba(0,120,212,0.15)', 'rgba(0,120,212,0.5)']"
          :gradient-direction="'top'"
          :model-value="props.burndownData.values"
          padding="2"
          line-width="1"
          color="rgb(0,120,212)"
          :smooth="true"
          height="28"
          width="160"
        ></v-sparkline>
        <span v-else class="text-caption text-medium-emphasis">No data</span>
      </v-sheet>
    </template>
    <v-card width="420" class="ado-border" rounded="md">
      <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b">
        <v-icon size="small" color="primary" class="mr-2">mdi-chart-line</v-icon>
        <span class="text-subtitle-2 font-weight-bold">Sprint Burndown</span>
      </div>
      <div class="pa-3">
        <v-sparkline
          v-if="hasData"
          fill
          :gradient="['rgba(0,120,212,0.15)', 'rgba(0,120,212,0.5)']"
          :gradient-direction="'top'"
          :model-value="props.burndownData.values"
          color="rgb(0,120,212)"
          padding="6"
          height="120"
          line-width="1.5"
          :smooth="true"
          :labels="props.burndownData.labels"
          label-size="3"
        ></v-sparkline>
        <div v-else class="text-center py-6 text-medium-emphasis">
          <v-icon size="32" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-body-2">No burndown data available yet.</div>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(['burndownData'])

const hasData = computed(() =>
  props.burndownData &&
  Array.isArray(props.burndownData.values) &&
  props.burndownData.values.length > 0
)
</script>

<style scoped>
.ado-empty-burndown {
  justify-content: center;
}
</style>

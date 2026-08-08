<template>
  <v-menu :disabled="!ready || loading" :close-on-content-click="false" location="bottom end" offset="8">
    <template #activator="{ props: activatorProps }">
      <v-sheet
        v-bind="activatorProps"
        max-width="160"
        width="160"
        height="32"
        class="cursor-pointer ado-border rounded-md px-2 d-flex align-center"
        rounded="md"
        :class="{ 'ado-empty-burndown': ready && !loading && !hasData }"
      >
        <v-progress-circular v-if="loading" indeterminate color="primary" size="18" width="2" class="mx-auto" />
        <v-sparkline
          v-else-if="hasData"
          fill
          :gradient="chartGradient"
          :gradient-direction="'top'"
          :model-value="props.burndownData.values"
          padding="2"
          line-width="1"
          :color="chartColor"
          :smooth="true"
          height="28"
          width="160"
        ></v-sparkline>
        <span v-else-if="ready" class="text-caption text-medium-emphasis">No data</span>
      </v-sheet>
    </template>
    <v-card width="420" class="ado-border" rounded="md">
      <div class="d-flex align-center px-3 py-2 ado-header-bg ado-border-b">
        <v-icon size="small" color="primary" class="mr-2">mdi-chart-line</v-icon>
        <span class="text-subtitle-2 font-weight-bold">Sprint Burndown</span>
      </div>
      <div class="pa-3">
        <div v-if="loading" class="ado-table-state">
          <v-progress-circular indeterminate color="primary" size="24" width="2" />
          <span>Loading burndown...</span>
        </div>
        <v-sparkline
          v-else-if="hasData"
          fill
          :gradient="chartGradient"
          :gradient-direction="'top'"
          :model-value="props.burndownData.values"
          :color="chartColor"
          padding="6"
          height="120"
          line-width="1.5"
          :smooth="true"
          :labels="props.burndownData.labels"
          label-size="3"
        ></v-sparkline>
        <div v-else-if="ready" class="text-center py-6 text-medium-emphasis">
          <v-icon size="32" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-body-2">No burndown data available yet.</div>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  burndownData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  ready: {
    type: Boolean,
    default: false
  }
})
const theme = useTheme()

const chartColor = computed(() => theme.current.value.colors.primary)
const chartGradient = computed(() => [
  withAlpha(chartColor.value, '20'),
  withAlpha(chartColor.value, '80')
])

const hasData = computed(() =>
  props.burndownData &&
  Array.isArray(props.burndownData.values) &&
  props.burndownData.values.length > 0
)

function withAlpha(color, alpha) {
  return /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alpha}` : color
}
</script>

<style scoped>
.ado-empty-burndown {
  justify-content: center;
}
</style>

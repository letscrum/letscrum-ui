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
    <v-card class="ado-panel ado-burndown-menu" rounded="sm">
      <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
        <v-icon size="20" color="primary" class="mr-2">mdi-chart-line</v-icon>
        <div>
          <div class="text-subtitle-2 font-weight-bold">Sprint Burndown</div>
          <div class="text-caption text-medium-emphasis">Remaining {{ unitLabel }} by day</div>
        </div>
      </div>
      <div class="ado-burndown-body">
        <div v-if="loading" class="ado-table-state">
          <v-progress-circular indeterminate color="primary" size="24" width="2" />
          <span>Loading burndown...</span>
        </div>
        <template v-else-if="hasData">
          <div class="ado-burndown-summary">
            <div class="ado-burndown-metric">
              <span>Total scope</span>
              <strong>{{ formatValue(total) }}</strong>
              <small>{{ unitLabel }}</small>
            </div>
            <div class="ado-burndown-metric">
              <span>Completed</span>
              <strong>{{ formatValue(completed) }}</strong>
              <small>{{ unitLabel }}</small>
            </div>
            <div class="ado-burndown-metric ado-burndown-metric--remaining">
              <span>Remaining</span>
              <strong>{{ formatValue(currentRemaining) }}</strong>
              <small>{{ unitLabel }}</small>
            </div>
          </div>

          <div class="ado-burndown-legend" aria-label="Chart legend">
            <span><i class="ado-burndown-legend__actual"></i>Actual remaining</span>
            <span><i class="ado-burndown-legend__ideal"></i>Ideal remaining</span>
          </div>

          <div class="ado-burndown-chart">
            <svg
              :viewBox="`0 0 ${chart.width} ${chart.height}`"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              :aria-label="chartDescription"
            >
              <defs>
                <linearGradient id="burndown-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" :stop-color="chartColor" stop-opacity=".18" />
                  <stop offset="1" :stop-color="chartColor" stop-opacity=".02" />
                </linearGradient>
              </defs>

              <text :x="chart.left" y="16" :fill="axisTextColor" class="ado-chart-axis-title">
                Remaining ({{ unitLabel }})
              </text>

              <g v-for="tick in yTicks" :key="tick.value">
                <line
                  :x1="chart.left"
                  :x2="plotRight"
                  :y1="tick.y"
                  :y2="tick.y"
                  :stroke="gridColor"
                  stroke-width="1"
                />
                <text
                  :x="chart.left - 10"
                  :y="tick.y + 4"
                  :fill="axisTextColor"
                  text-anchor="end"
                  class="ado-chart-tick"
                >
                  {{ formatValue(tick.value) }}
                </text>
              </g>

              <path :d="actualAreaPath" fill="url(#burndown-area-gradient)" />
              <path
                :d="idealPath"
                fill="none"
                :stroke="idealColor"
                stroke-width="2"
                stroke-dasharray="7 5"
              />
              <path
                :d="actualPath"
                fill="none"
                :stroke="chartColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <g v-for="point in actualPoints" :key="point.index">
                <circle
                  :cx="point.x"
                  :cy="point.y"
                  r="4"
                  :fill="surfaceColor"
                  :stroke="chartColor"
                  stroke-width="2.5"
                >
                  <title>{{ point.label }}: {{ formatValue(point.value) }} {{ unitLabel }} remaining</title>
                </circle>
              </g>

              <g v-for="tick in xTicks" :key="tick.index">
                <line
                  :x1="tick.x"
                  :x2="tick.x"
                  :y1="plotBottom"
                  :y2="plotBottom + 5"
                  :stroke="gridColor"
                />
                <text
                  :x="tick.x"
                  :y="plotBottom + 22"
                  :fill="axisTextColor"
                  text-anchor="middle"
                  class="ado-chart-tick"
                >
                  {{ tick.label }}
                </text>
              </g>
              <text
                :x="chart.left + plotWidth / 2"
                :y="chart.height - 4"
                :fill="axisTextColor"
                text-anchor="middle"
                class="ado-chart-axis-title"
              >
                Sprint date
              </text>
            </svg>
          </div>
        </template>
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
const chart = {
  bottom: 46,
  height: 290,
  left: 56,
  right: 18,
  top: 28,
  width: 600
}

const chartColor = computed(() => theme.current.value.colors.primary)
const idealColor = computed(() => theme.current.value.colors.secondary)
const gridColor = computed(() => theme.current.value.colors.border)
const axisTextColor = computed(() => theme.current.value.colors['on-surface-variant'])
const surfaceColor = computed(() => theme.current.value.colors.surface)
const chartGradient = computed(() => [
  withAlpha(chartColor.value, '20'),
  withAlpha(chartColor.value, '80')
])

const hasData = computed(() =>
  props.burndownData &&
  Array.isArray(props.burndownData.values) &&
  props.burndownData.values.length > 0 &&
  total.value > 0
)
const total = computed(() => Number(props.burndownData.total) || 0)
const unitLabel = computed(() => props.burndownData.unit === 'hours' ? 'hours' : 'tasks')
const currentRemaining = computed(() => {
  const values = props.burndownData.values || []
  return Number(values.at(-1)) || 0
})
const completed = computed(() => Math.max(0, total.value - currentRemaining.value))
const plotWidth = computed(() => chart.width - chart.left - chart.right)
const plotHeight = computed(() => chart.height - chart.top - chart.bottom)
const plotRight = computed(() => chart.left + plotWidth.value)
const plotBottom = computed(() => chart.top + plotHeight.value)
const yMax = computed(() => Math.max(4, Math.ceil(total.value / 4) * 4))

const actualPoints = computed(() => createPoints(props.burndownData.values || []))
const idealPoints = computed(() => createPoints(props.burndownData.ideal || []))
const actualPath = computed(() => pathFor(actualPoints.value))
const idealPath = computed(() => pathFor(idealPoints.value))
const actualAreaPath = computed(() => {
  if (!actualPoints.value.length) return ''
  const first = actualPoints.value[0]
  const last = actualPoints.value.at(-1)
  return `M ${first.x} ${plotBottom.value} L ${actualPoints.value.map(point => `${point.x} ${point.y}`).join(' L ')} L ${last.x} ${plotBottom.value} Z`
})
const yTicks = computed(() => Array.from({ length: 5 }, (item, index) => ({
  value: yMax.value * (4 - index) / 4,
  y: chart.top + plotHeight.value * index / 4
})))
const xTicks = computed(() => {
  const labels = props.burndownData.labels || []
  if (!labels.length) return []
  const lastIndex = labels.length - 1
  const indexes = labels.length <= 5
    ? labels.map((item, index) => index)
    : [0, Math.round(lastIndex / 4), Math.round(lastIndex / 2), Math.round(lastIndex * 3 / 4), lastIndex]
  return [...new Set(indexes)].map(index => ({
    index,
    label: labels[index],
    x: xFor(index, labels.length)
  }))
})
const chartDescription = computed(() =>
  `Sprint burndown. ${formatValue(currentRemaining.value)} ${unitLabel.value} remaining from ${formatValue(total.value)} total. Solid line is actual remaining and dashed line is ideal remaining.`
)

function createPoints(values) {
  const labels = props.burndownData.labels || []
  return values.map((value, index) => ({
    index,
    label: labels[index] || `Day ${index + 1}`,
    value: Number(value) || 0,
    x: xFor(index, values.length),
    y: chart.top + (1 - (Number(value) || 0) / yMax.value) * plotHeight.value
  }))
}

function xFor(index, length) {
  if (length <= 1) return chart.left
  return chart.left + index / (length - 1) * plotWidth.value
}

function pathFor(points) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
}

function formatValue(value) {
  const number = Number(value) || 0
  if (props.burndownData.unit !== 'hours') return Math.round(number)
  return Number.isInteger(number) ? number : number.toFixed(1)
}

function withAlpha(color, alpha) {
  return /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alpha}` : color
}
</script>

<style scoped>
.ado-empty-burndown {
  justify-content: center;
}
.ado-burndown-menu {
  width: min(680px, calc(100vw - 24px));
}
.ado-burndown-body {
  padding: 16px;
}
.ado-burndown-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 14px;
  background-color: var(--ado-subtle-bg);
  border: 1px solid var(--ado-border);
}
.ado-burndown-metric {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 8px;
  padding: 10px 12px;
  border-right: 1px solid var(--ado-border);
}
.ado-burndown-metric:last-child {
  border-right: 0;
}
.ado-burndown-metric span {
  color: var(--ado-text-secondary);
  font-size: 12px;
}
.ado-burndown-metric strong {
  grid-row: span 2;
  color: rgb(var(--v-theme-on-surface));
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
}
.ado-burndown-metric small {
  color: var(--ado-text-tertiary);
  font-size: 11px;
}
.ado-burndown-metric--remaining {
  box-shadow: inset 3px 0 rgb(var(--v-theme-primary));
}
.ado-burndown-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  margin-bottom: 8px;
  color: var(--ado-text-secondary);
  font-size: 12px;
}
.ado-burndown-legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.ado-burndown-legend i {
  display: inline-block;
  width: 24px;
  height: 0;
  border-top: 3px solid rgb(var(--v-theme-primary));
}
.ado-burndown-legend .ado-burndown-legend__ideal {
  border-top: 2px dashed rgb(var(--v-theme-secondary));
}
.ado-burndown-chart {
  width: 100%;
  overflow: hidden;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid var(--ado-border);
}
.ado-burndown-chart svg {
  display: block;
  width: 100%;
  height: auto;
}
.ado-chart-axis-title {
  font-family: var(--ado-font-family);
  font-size: 11px;
  font-weight: 600;
}
.ado-chart-tick {
  font-family: var(--ado-font-family);
  font-size: 10px;
}
@media (max-width: 560px) {
  .ado-burndown-body {
    padding: 12px;
  }
  .ado-burndown-summary {
    grid-template-columns: 1fr;
  }
  .ado-burndown-metric {
    border-right: 0;
    border-bottom: 1px solid var(--ado-border);
  }
  .ado-burndown-metric:last-child {
    border-bottom: 0;
  }
  .ado-burndown-legend {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>

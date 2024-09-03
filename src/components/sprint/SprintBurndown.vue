<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-sheet max-width="200px">
        <v-sparkline
          v-bind="activatorProps"
          fill
          :gradient="['rgb(0,120,212)']"
          line-width="0"
          :model-value="value"
          padding="0"
          :smooth="false"
        ></v-sparkline>
      </v-sheet>
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-sparkline
          fill
          :gradient="['rgb(0,120,212)']"
          line-width="0"
          :model-value="value"
          padding="4"
          height="120"
          :smooth="false"
          :labels="labels"
          label-size="2"
        ></v-sparkline>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { getSprintItemBurndown } from '@/apis/sprint';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const dialog = ref(false)
const labels = ref([])
const value = ref([])

onMounted(() => {
  getSprintItemBurndown(route.params.orgId, route.params.projectId, route.params.sprintId).then((res) => {
    console.log(res)
    // get res.data.burndown list date convert to date unix timestamp to date format and set to labels value
    labels.value = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10) )

    // get res.data.burndown list actual and set to value value
    value.value = res.data.burndown.map((item) => item.actual)
  })
})

</script>

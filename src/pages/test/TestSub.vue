<template>
  <div>
    <v-expansion-panels variant="accordion" multiple>
      <v-expansion-panel v-for="item in workItems" :key="item.id">
        <v-expansion-panel-title>
          <v-row no-gutters>
            <v-col class="d-flex justify-start" cols="8">
              <ItemDetail :item="item">
                {{ item.title }}
              </ItemDetail>
            </v-col>
            <v-col
              class="text--secondary"
              cols="4"
            >
              {{ item.status }}
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row
            v-for="task in item.tasksAll" :key="task.id" no-gutters
          >
            <v-col cols="3">
              {{ task.title }}
            </v-col>

            <v-col cols="3">
              {{ task.status }}
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

</template>

<script setup>

</script>

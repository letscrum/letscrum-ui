<template>
  <div>

    <v-row no-gutters>
      <v-col>
        <v-data-iterator
          :items="workItems"
          hide-default-footer
        >
          <template v-slot:header>
            <v-row no-gutters>
              <v-col cols="2">
                <!-- <v-btn variant="plain" prepend-icon="mdi-arrow-expand-vertical" size="x-small" @click="expandAll = !expandAll" v-if="expandAll">
                  Expand all
                </v-btn>
                <v-btn variant="plain" prepend-icon="mdi-arrow-collapse-vertical" size="x-small" @click="expandAll = !expandAll" v-else>
                  Collapse all
                </v-btn> -->
              </v-col>
              <v-col cols="10">
                <v-row no-gutters>
                  <v-col cols="4">
                    To Do
                  </v-col>
                  <v-col cols="4">
                    In Progress
                  </v-col>
                  <v-col cols="4">
                    Done
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
          <template v-slot:default="{ items, isExpanded, toggleExpand }">
            <div v-for="item in items" :key="item.raw.id">
              <v-expand-transition>
                <v-row no-gutters v-if="!isExpanded(item)">
                  <v-col cols="2">
                    <v-icon icon="mdi-menu-down" size="x-small" width="10%" class="float-left" @click="() => toggleExpand(item)"></v-icon>
                    <v-sheet tile outlined class="mb-2 mr-2 float-left"
                      style="border-left-color: rgb(0, 156, 204); border-width: 1px; border-left-width: 3px;"
                      width="85%" min-width="160" height="100">
                        {{ item.raw.id }}
                    </v-sheet>
                  </v-col>
                  <v-col cols="10">
                    <v-row no-gutters>
                      <v-col cols="4">
                        <v-row no-gutters>
                          <v-col>
                            <v-sheet tile outlined class="mb-2 mr-2 float-left" v-for="task in item.raw.tasks" :key="task.id"
                              style="border-left-color: rgb(242, 203, 29); border-width: 1px; border-left-width: 3px;"
                              width="185" height="100">
                                {{ task.id }}
                            </v-sheet>
                          </v-col>
                        </v-row>
                        <v-spacer></v-spacer>
                        <v-row no-gutters>
                          <v-col>
                            <v-btn variant="plain" prepend-icon="mdi-plus" size="small" class="mr-2">
                              New task
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="4">
                        <div v-for="task in item.tasks" :key="task.id">
                          <v-sheet tile outlined class="mb-2 mr-2 float-left"
                            v-if="task.name === '2'"
                            style="border-left-color: rgb(242, 203, 29); border-left-width: 8px;"
                            min-width="185"
                            min-height="120"
                            max-width="185">
                              Test
                          </v-sheet>
                        </div>
                      </v-col>
                      <v-col cols="4">
                        <div v-for="task in item.tasks" :key="task.id">
                          <v-sheet tile outlined class="mb-2 mr-2 float-left"
                            v-if="task.name === '3'"
                            style="border-left-color: rgb(242, 203, 29); border-left-width: 8px;"
                            min-width="185"
                            min-height="120"
                            max-width="185">
                              Test
                          </v-sheet>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row no-gutters v-else>
                  <v-col>
                    <v-icon icon="mdi-menu-right" size="x-small" class="float-left" @click="() => toggleExpand(item)"></v-icon>
                    {{ item.raw.title }}
                  </v-col>
                </v-row>
              </v-expand-transition>
            </div>
          </template>
        </v-data-iterator>
      </v-col>
      <v-divider vertical />
      <v-col v-if="workDetail" cols="3">
        <v-card flat tile>
          <v-card-title>
            <span class="text-h5">Work Details</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="workDetail = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            123<br/>
            123<br/>
            123<br/>
            123
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'

import { getGetWorkItems } from '@/apis/workitem';

import { useRoute } from 'vue-router'

import { useAppStore } from '@/stores/app'

const store = useAppStore()

const route = useRoute()

const workItems = ref([])
const allWorkItems = ref([])

const workDetail = ref(false)
const expandAll = ref(false)

function LoadWorkItems() {
  getGetWorkItems(route.params.projectId, {
    sprintId: route.params.sprintId
  }).then(res => {
    allWorkItems.value = res.data.items
    workItems.value = res.data.items
    console.log(workItems.value)
  })
}


function filterTasks(userId) {
  console.log("userId", userId)
  console.log(allWorkItems.value)
  if (userId > 0) {
    workItems.value = allWorkItems.value.filter(item => item.assignUser.id === userId)
  }
  if (userId === 0) {
    workItems.value = allWorkItems.value.filter(item => item.assignUser.id === Number(store.user.id))
  }
  if (userId === -1) {
    workItems.value = allWorkItems.value
  }
}

defineExpose({ filterTasks })



onMounted(() => {
  LoadWorkItems()
})

</script>

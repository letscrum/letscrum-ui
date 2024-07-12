<template>
  <div>
    <v-btn @click="AddWorkItem()"></v-btn>
    <v-row no-gutters>
      <v-col>
        <v-data-iterator
          :items="workItems"
          hide-default-footer
          v-model:expanded="expanded"
          items-per-page="-1"
        >
          <template v-slot:header>
            <v-row no-gutters>
              <v-col cols="2">
                <v-btn variant="plain" prepend-icon="mdi-arrow-expand-vertical" size="x-small" @click="expanded = []" v-if="expanded.length > 0">
                  Expand all
                </v-btn>
                <v-btn variant="plain" prepend-icon="mdi-arrow-collapse-vertical" size="x-small" @click="collapseAll()" v-else>
                  Collapse all
                </v-btn>
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
              <v-expand-transition v-if="item.raw.id > 0">
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
              <div v-else>
                <v-row no-gutters v-if="!isExpanded(item)">
                  <v-col cols="2">
                    <v-icon icon="mdi-menu-down" size="x-small" width="10%" class="float-left"></v-icon>
                    <v-sheet tile outlined class="mb-2 mr-2 float-left"
                      style="border-left-color: rgb(0, 156, 204); border-width: 1px; border-left-width: 3px;"
                      width="85%" min-width="160" height="100">
                        <input style="border-width: 1px; border-style: solid; border-color: gray; margin: 2px 2px 2px 2px;" type="textarea" />
                    </v-sheet>
                  </v-col>
                  <v-col cols="10">
                  </v-col>
                </v-row>
              </div>
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
const expanded = ref([])

function LoadWorkItems() {
  getGetWorkItems(route.params.projectId, {
    sprintId: route.params.sprintId
  }).then(res => {
    allWorkItems.value = res.data.items
    workItems.value = res.data.items
    console.log('workItems', workItems.value)
  })
}

function AddWorkItem() {
  console.log('expanded', expanded.value)
  // remove last item from expanded list
  expanded.value.pop()
}

function filterTasks(userId) {
  console.log('userId', userId, typeof userId)
  let myItems = []
  if (userId > 0) {
    // if allWorkItems assignUser.id or any tasks assignUser.id is equal to userId, add to myItems
    myItems = allWorkItems.value.filter(item => {
      if (item.assignUser.id === userId.toString()) {
        return item
      }
      for (let i = 0; i < item.tasks.length; i++) {
        if (item.tasks[i].assignUser.id === userId.toString()) {
          return item
        }
      }
    })
  }
  if (userId === 0) {
    myItems = allWorkItems.value.filter(item => {
      if (item.assignUser.id === store.user.id.toString()) {
        return item
      }
      for (let i = 0; i < item.tasks.length; i++) {
        if (item.tasks[i].assignUser.id === store.user.id.toString()) {
          return item
        }
      }
    })
  }
  if (userId === -1) {
    myItems = allWorkItems.value
  }
  expanded.value = []
  // if in allWorkItems, but not in myItems, add to expanded
  for (let i = 0; i < allWorkItems.value.length; i++) {
    if (!myItems.includes(allWorkItems.value[i])) {
      expanded.value.push((i+1).toString())
    }
  }
}

defineExpose({ filterTasks })

function collapseAll() {
  expanded.value = []
  for (let i = 0; i < workItems.value.length; i++) {
    expanded.value.push((i+1).toString())
  }
  console.log('expanded', expanded.value)
}


onMounted(() => {
  LoadWorkItems()
})

</script>

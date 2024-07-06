<template>
  <DefaultLayout>
    <v-tabs>
      <v-tab to="taskboard">Taskboard</v-tab>
      <v-tab to="backlog">Backlog</v-tab>
      <v-tab to="capacity">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all project members</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-arrow-right
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all members from last sprint</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-order-bool-ascending
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense>
            <v-list-item-subtitle>Side Panel</v-list-item-subtitle>
          </v-list-item>
          <v-list-item dense @click="workDetail = !workDetail">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-briefcase
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Work details</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col>
        <v-data-iterator
          :items="workitems"
          item-key="id"
          hide-default-footer
        >
          <template v-slot:header>
            <v-row no-gutters>
              <v-col cols="2">
                <v-btn tile text small v-if="singleExpand">
                  <v-icon left>
                    mdi-arrow-expand-vertical
                  </v-icon>
                  Expand all
                </v-btn>
                <v-btn tile text small v-else>
                  <v-icon left>
                    mdi-arrow-collapse-vertical
                  </v-icon>
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
          <template v-slot:default="{ items, isExpanded, expand }">
            <div v-for="item in items" :key="item.id">
              <v-row no-gutters v-if="!isExpanded(item)">
                <v-col cols="2">
                  <v-btn tile icon x-small class="float-left"
                    @click="expand(item, true)">
                    <v-icon>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                  <v-sheet tile outlined class="mb-2 mr-2 float-left"
                    style="border-left-color: rgba(0, 103, 181, 1); border-left-width: 8px;"
                    min-width="200" max-width="200" min-height="120">
                      Test
                  </v-sheet>
                </v-col>
                <v-col cols="10">
                  <v-row no-gutters>
                    <v-col cols="4">
                      <div v-for="task in item.tasks" :key="task.id">
                        <v-sheet tile outlined class="mb-2 mr-2 float-left"
                          v-if="task.name === '1'"
                          style="border-left-color: rgb(242, 203, 29); border-left-width: 8px;"
                          min-width="185"
                          min-height="120"
                          max-width="185">
                            Test
                        </v-sheet>
                      </div>
                      <v-btn tile text small class="mr-2">
                        <v-icon left>
                          mdi-plus
                        </v-icon>
                        New task
                      </v-btn>
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
                  <v-btn tile icon x-small class="float-left"
                    @click="expand(item, false)">
                    <v-icon>
                      mdi-menu-right
                    </v-icon>
                  </v-btn>
                  {{ item }}
                </v-col>
              </v-row>
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
            <v-btn icon @click="workDetail = false">
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
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue';

</script>
<script>

export default {
  data: () => ({
    workDetail: false,
    workitems: [{
      id: 1,
      name: 123,
      tasks: [{
        id: 1,
        name: '1'
      },
      {
        id: 2,
        name: '3'
      },
      {
        id: 3,
        name: '2'
      },
      {
        id: 4,
        name: '2'
      },
      {
        id: 5,
        name: '2'
      },
      {
        id: 6,
        name: '2'
      },
      {
        id: 7,
        name: '2'
      }]
    },
    {
      id: 2,
      name: 123
    },
    {
      id: 3,
      name: 123
    },
    {
      id: 5,
      name: 123
    },
    {
      id: 6,
      name: 123
    },
    {
      id: 7,
      name: 123
    },
    {
      id: 9,
      name: 123
    },
    {
      id: 8,
      name: 123
    }],
    singleExpand: false,
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        sodium: 87,
        calcium: '14%',
        iron: '1%'
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        sodium: 129,
        calcium: '8%',
        iron: '1%'
      },
      {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        sodium: 337,
        calcium: '6%',
        iron: '7%'
      },
      {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        sodium: 413,
        calcium: '3%',
        iron: '8%'
      }
    ]
  })
};
</script>

<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>{{ store.sprint.name }}</h2>
      </v-col>
      <v-col>
        {{ store.sprint.startDate }} - {{ store.sprint.endDate }}
        <v-menu offset-y bottom left min-width="300">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" prepend-icon="mdi-chevron-down" variant="text" class="float-right">
              {{ store.sprint.name }}
            </v-btn>
          </template>
          <v-list>
            <v-virtual-scroll height="350" item-height="64" :items="sprints">
              <template v-slot:default="{ item }">
                <v-list-item
                  :to="'/projects/' + item.projectId + '/sprints/' + item.id"
                  two-line
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(item.startDate * 1000).toISOString().substr(0, 10) }}
                      - {{ new Date(item.endDate * 1000).toISOString().substr(0, 10) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <v-chip
                        :color="item.status === 'CURRENT' ? 'primary' : ''"
                        small
                      >
                        {{ item.status }}
                      </v-chip>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
          <v-list>
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>New Sprint</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Create Sprint</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Name"
                          required
                          v-model="sprintName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="rangeDate"
                              label="Picker without buttons"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            no-title
                            range
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn text @click="onCreateSprint">
                    Create
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-tabs>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId">Taskboard</v-tab>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/backlog'">Backlog</v-tab>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/capacity'">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <router-view name="menu" />
    </v-tabs>
    <v-divider class="my-2"></v-divider>
    <router-view />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue';
import { getGetSprints, postCreateSprint } from '@/apis/sprint';
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useAppStore()

const route = useRoute()

const sprints = ref([])


function LoadSprints() {
  getGetSprints(route.params.projectId, {
    page: 1,
    size: 999
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      sprints.value = res.data.items;
      console.log(sprints.value);
      // get sprints status 'Current' item and set to store
      if (store.sprint.id === 0) {
        const currentSprint = sprints.value.find((item) => item.status === 'Current')
        if (currentSprint) {
          store.setSprint({
            id: currentSprint.id,
            name: currentSprint.name,
            startDate: currentSprint.startDate,
            endDate: currentSprint.endDate
          })
        }
      }
    }
  })
}

function onSetSprint(id, name, startDate, endDate) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate
  })
}

onMounted(() => {
  LoadSprints()
})
</script>

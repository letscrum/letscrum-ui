<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>{{ store.sprint.name }}</h2>
      </v-col>
      <v-col>
        <!-- <v-select
          density="compact"
          width="100"
          :items="['All', ...sprint.members.map((item) => item.userName)]"
        ></v-select> -->
        <v-menu offset-y bottom left width="400">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" append-icon="mdi-chevron-down" size="large" variant="text" class="float-right">
              {{ store.sprint.name }}
            </v-btn>
          </template>
          <v-list>
            <v-virtual-scroll height="320" item-height="64" :items="sprints">
              <template v-slot:default="{ item }">
                <v-list-item
                  :to="'/projects/' + item.projectId + '/sprints/' + item.id"
                  lines="two"
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                  :title="item.name"
                  :subtitle="new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' - ' + new Date(item.endDate * 1000).toISOString().substring(0, 10)"
                >
                  <template v-slot:append>
                    <v-chip
                      :color="item.status === 'Current' ? 'primary' : ''"
                      :variant="item.status === 'Current' ? 'flat' : 'tonal'"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
            <v-divider class="my-2"></v-divider>
            <SprintCreate @afterCreate="LoadSprints()">
              <v-list-item title="New Sprint" @click="console.log()">
                <template v-slot:prepend>
                  <v-icon>mdi-plus</v-icon>
                </template>
              </v-list-item>
            </SprintCreate>
          </v-list>
        </v-menu>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" append-icon="mdi-chevron-down" size="large" variant="text" class="float-right">
              {{ member.userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="setMember(-1, 'All')" title="All"></v-list-item>
            <v-list-item @click="setMember(0, '@Me')" title="@Me"></v-list-item>

            <v-list-item
              @click="setMember(item.userId, item.userName)"
              v-for="(item, i) in sprint.members"
              :key="i"
              :title="item.userName"
            >
            </v-list-item>
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
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="mainContent" />
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue';
import { getGetSprints } from '@/apis/sprint';
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useAppStore()

const route = useRoute()

const sprints = ref([])

const sprint = ref({})

const member = ref({
  userId: 0,
  userName: 'All'
})

const mainContent = ref()

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
          sprint.value = currentSprint
        }
      } else {
        const currentSprint = sprints.value.find((item) => item.id === route.params.sprintId)
        sprint.value = currentSprint
      }
      console.log(sprint.value)
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

function setMember(userId, userName) {
  member.value.userId = userId
  member.value.userName = userName
  mainContent.value.filterTasks(userId)
}

onMounted(() => {
  LoadSprints()
})
</script>
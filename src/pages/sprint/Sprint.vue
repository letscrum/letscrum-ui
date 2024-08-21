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
          <template #activator="{ props }">
            <v-btn v-bind="props" append-icon="mdi-chevron-down" size="large" variant="text" class="float-right">
              {{ store.sprint.name }}
            </v-btn>
          </template>
          <v-list>
            <v-virtual-scroll height="320" item-height="64" :items="sprints">
              <template #default="{ item }">
                <v-list-item
                  :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
                  lines="two"
                  :title="item.name"
                  :subtitle="new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' - ' + new Date(item.endDate * 1000).toISOString().substring(0, 10)"
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                >
                  <template #append>
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
            <SprintCreate @after-create="LoadSprints()">
              <v-list-item title="New Sprint" @click="console.log()">
                <template #prepend>
                  <v-icon>mdi-plus</v-icon>
                </template>
              </v-list-item>
            </SprintCreate>
          </v-list>
        </v-menu>

        <v-menu v-if="route.name == 'SprintTaskboard'">
          <template #activator="{ props }">
            <v-btn v-bind="props" append-icon="mdi-chevron-down" size="large" variant="text" class="float-right">
              {{ member.userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item title="All" @click="setMember('all', 'All')"></v-list-item>
            <v-list-item title="@Me" @click="setMember(store.user.id, '@Me')"></v-list-item>

            <v-list-item
              v-for="(item, i) in sprint.members"
              :key="i"
              :title="item.userName"
              @click="setMember(item.userId, item.userName)"
            >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <v-tabs>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId">Taskboard</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/backlog'">Backlog</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/capacity'">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <router-view name="menu" @create-work-item="onCreateWorkItem" @show="onShow">
      </router-view>
    </v-tabs>
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="mainContent" :sprints="sprints" />
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
  getGetSprints(store.org.id, route.params.projectId, {
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
  mainContent.value.LoadWorkItems()

  router.push(`/orgs/${store.org.id}/projects/${route.params.projectId}/sprints/${id}`)
}

function setMember(userId, userName) {
  member.value.userId = userId
  member.value.userName = userName
  mainContent.value.filterTasks(userId)
}

function onCreateWorkItem(workItemType) {
  console.log('create work item', workItemType)
  mainContent.value.AddWorkItem(workItemType)
}

function onShow(type) {
  mainContent.value.show(type)
}
onMounted(() => {
  LoadSprints()
})
</script>

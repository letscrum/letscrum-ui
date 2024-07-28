<template>
  <DefaultLayout>
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon>
        Members
        <v-spacer></v-spacer>
        <v-btn @click="fetchUsers">Refresh</v-btn>
        <v-spacer></v-spacer>

        <v-btn @click="onCreate">Create</v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-card-title>
      <v-spacer></v-spacer>

      <v-divider></v-divider>
      <v-data-table v-model:search="search" :items="members">

        <template v-slot:item.isAdmin="{ item }">
          <SetOrgAdmin :member="item" @after="fetchMembers">
            <v-btn>
              {{ item.isAdmin ? 'Remove admin' : 'Set admin' }}
            </v-btn>
          </SetOrgAdmin>
        </template>

      </v-data-table>
    </v-card>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { getGetOrgMembers } from '@/apis/org'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const search = ref('')
const members = ref([])

function fetchMembers() {
  getGetOrgMembers(store.org.id).then((res) => {
    console.log(res)
    members.value = res.data.items
  })
}

function onCreate() {
  // random user name length 6
  let userName = Math.random().toString(36).substring(2, 8)
}

onMounted(() => {
  fetchMembers()
})

</script>

<template>
  <DefaultLayout>
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
        Users
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
      <v-data-table v-model:search="search" :items="users">

        <template v-slot:item.isSuperAdmin="{ item }">
          <SetSuperAdmin :user="item" @after="fetchUsers">
            <v-btn>
              {{ item.isSuperAdmin ? 'Remove super admin' : 'Set super admin' }}
            </v-btn>
          </SetSuperAdmin>
        </template>

      </v-data-table>
    </v-card>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { getGetUsers, postCreateUser } from '@/apis/user'

const search = ref('')
const users = ref([])

function fetchUsers() {
  getGetUsers({
    page: 1,
    size: 999,
    keyword: search.value,
  }).then((res) => {
    console.log(res)
    users.value = res.data.items
  })
}

function onCreate() {
  // random user name length 6
  let userName = Math.random().toString(36).substring(2, 8)

  postCreateUser({
    name: userName,
    email: 'admin@123.com',
    password: '123456',
  }).then(() => {
    fetchUsers()
  })
}

onMounted(() => {
  fetchUsers()
})

</script>

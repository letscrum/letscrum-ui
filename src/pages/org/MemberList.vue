<template>
  <DefaultLayout>
    {{ org }}
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon>
        Members
        <v-spacer></v-spacer>

        <v-dialog
          v-model="dialogAdd"
          width="50%"
          persistent
        >
          <template #activator="{ props: activatorProps }">
            <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps">
              Add
            </v-btn>
          </template>

          <template #default="{ isActive }">
            <v-card
              prepend-icon="mdi-earth"
              title="Select Country"
            >
              <v-divider class="my-1"></v-divider>

              <v-card-text class="px-4">
                <v-autocomplete
                  v-model:search-input="search"
                  v-model="addMembers"
                  chips
                  :items="users"
                  label="Autocomplete"
                  multiple
                  item-props
                  no-filter
                  @update:search="searchUsers"
                >
                  <template #chip="{ props, item }">
                    <v-chip
:closable="!item.raw.owner"
                      v-bind="props"
                      :text="item.raw.name"
                    ></v-chip>
                  </template>
                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :title="item.raw.name"
                    ></v-list-item>
                  </template>
                </v-autocomplete>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  text="Close"
                  @click="isActive.value = false"
                ></v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  color="surface-variant"
                  text="Save"
                  variant="flat"
                  @click="onAdd()"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

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

        <template #item.isAdmin="{ item }">
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
import { getGetOrgMembers, postAddOrgMembers, getGetOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { getGetUsers } from '@/apis/user'

const store = useAppStore()

const dialogAdd = ref(false)

const search = ref('')
const members = ref([])
const addMembers = ref([])
const users = ref([])
const org = ref({})

function fetchMembers() {
  getGetOrgMembers(store.org.id).then((res) => {
    console.log(res)
    members.value = res.data.items
  })
}

const searchUsers = val => {
  if (!val) {
    users.value = []
    return false
  }
  getGetUsers({
    keyword: val,
    page: 1,
    size: 999,
  }).then(res => {
    if (res.status === 200) {
      users.value = res.data.items
      console.log(members.value)
    }
  })
}

function onAdd() {
  postAddOrgMembers(store.org.id, {
    members: addMembers.value.map((member) => {
      return {
        userId: member.id,
        isAdmin: false,
      }
    })
  }).then((res) => {
    console.log(res)
    fetchMembers()
    dialogAdd.value = false
  })

}

function getOrg() {
  getGetOrg(store.org.id).then((res) => {
    console.log(res)
    org.value = res.data.item
  })
}

onMounted(() => {
  getOrg()
  fetchMembers()
})

</script>

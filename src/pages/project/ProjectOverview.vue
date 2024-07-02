<template>
  <DefaultLayout>
  <div class="ma-2">
  <v-row no-gutters>
    <v-col>
      <h2>{{ project.name }}</h2>
    </v-col>
    <v-col>
      <v-dialog
        width="50%"
        persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps">
            Edit
          </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card
            prepend-icon="mdi-earth"
            title="Select Country"
          >
            <v-divider class="my-1"></v-divider>

            <v-card-text class="px-4">
              <v-text-field label="Label"></v-text-field>

              <v-textarea label="Label"></v-textarea>

              <v-autocomplete
                v-model="members"
                chips
                closable-chips
                :items="users"
                label="Autocomplete"
                multiple
                @update:search="searchUsers"
                auto-select-first
                item-props
              ></v-autocomplete>
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
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
  <v-divider class="my-2"></v-divider>
  </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { useAppStore } from '@/stores/app'
import { onMounted, ref, watch } from 'vue';
import { getGetProject } from '@/apis/project'
import { getUsers } from '@/apis/user'

const project = ref({})
const members = ref([])
const users = ref([])

function searchUsers(keyword) {
  console.log('call searchUsers')
  if (!keyword) {
    return
  }
  getUsers({
    keyword: keyword,
    page: 1,
    size: 999,
  }).then(res => {
    if (res.status === 200) {
      users.value = res.data.items
      console.log(users.value)
    }
  })
}

const store = useAppStore()
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  project.value = store.project
})
</script>

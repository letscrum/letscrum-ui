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

      </v-card-title>
      <v-spacer></v-spacer>

      <v-divider></v-divider>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
            </th>
            <th class="text-left">
              Name
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in members"
            :key="item.member.id"
          >
            <td>
              <user-avatar :user-id="item.member.id" :user-name="item.member.name"></user-avatar>
            </td>
            <td>{{ item.member.name }}</td>
            <td>
              <div v-if="item.member.name == org.createdBy">
                Owner
              </div>
              <SetOrgAdmin v-else :member="item" @after="fetchMembers">
                <v-btn>
                  {{ item.isAdmin ? 'Remove admin' : 'Set admin' }}
                </v-btn>
              </SetOrgAdmin>
            </td>
            <td>
              <OrgMemberDelete :member="item" @after="fetchMembers">
                <v-btn>
                  X
                </v-btn>
              </OrgMemberDelete>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-dialog v-model="dialogDelete" width="50%">
      <template #activator="{ props: activatorProps }">
        <v-btn block color="red" v-bind="activatorProps">Delete Org</v-btn>
      </template>
      <template #default="{ isActive }">
        <v-card>
          <v-card-title>Delete Org</v-card-title>
          <v-card-text>
            Are you sure you want to delete this org?
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="isActive.value = false">Cancel</v-btn>
            <v-btn text @click="onDeleteOrg()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { getGetOrgMembers, postAddOrgMembers, getGetOrg, getGetOrgs, deleteDeleteOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { getGetUsers } from '@/apis/user'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

const dialogAdd = ref(false)
const dialogDelete = ref(false)

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

function onDeleteOrg() {
  deleteDeleteOrg(store.org.id).then((res) => {
    if (res.status === 200) {
      if (store.org.id == store.org.id) {
        store.clearOrg()
      }
      getGetOrgs().then((res) => {
        if (res.status === 200) {
          store.setOrgs(res.data.items.map((item) => {
            return {
              id: item.id,
              name: item.name,
              displayName: item.displayName,
              description: item.description,
              myRole: item.myRole,
            }
          }))
          router.push('/orgs')
          dialogDelete.value = false
        }
      })
    }
  })
}

onMounted(() => {
  getOrg()
  fetchMembers()
})

</script>

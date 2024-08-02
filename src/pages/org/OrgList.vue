<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>Org List</h2>
      </v-col>
      <v-col>
        <v-dialog
          v-model="dialog"
          width="50%"
          persistent
        >
          <template #activator="{ props: activatorProps }">
            <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenOrg()">
              Create
            </v-btn>
          </template>

          <template #default="{ isActive }">
            <v-card
              prepend-icon="mdi-earth"
              title="Select Country"
            >
              <v-divider class="my-1"></v-divider>

              <v-card-text class="px-4">
                <v-text-field v-model="org.name" label="Label"></v-text-field>

                <v-textarea v-model="org.description" label="Label"></v-textarea>

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
                  @click="createOrg()"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row no-gutters>
      <v-col v-for="(org, i) in orgs" :key="i" cols="12" md="4" class="pa-1">
        <OrgCard :org="org"></OrgCard>
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted, ref } from 'vue';

import { getGetOrgs, postCreateOrg } from '@/apis/org';

const orgs = ref([])
const org = ref({})
const dialog = ref(false)


function onOpenOrg() {
  org.value = {}
  dialog.value = true
}

function createOrg() {
  console.log(org.value)
  postCreateOrg({
    name: org.value.name,
  }).then((res) => {
    console.log(res)
    if (res.status === 200) {
      LoadOrgs()
      dialog.value = false
    }
  })
}

onMounted(() => {
  LoadOrgs()
})

function LoadOrgs() {
  getGetOrgs({
    page: 1,
    size: 12
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      orgs.value = res.data.items;
    }
  });
}

// const pages = computed({
//   get() {
//     return Math.ceil(this.total / this.size);
//   }
// })
</script>

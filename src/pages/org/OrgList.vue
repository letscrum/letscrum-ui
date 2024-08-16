<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>Org List</h2>
      </v-col>
      <v-col>
        <OrgCreate>
          <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil">
            Create
          </v-btn>
        </OrgCreate>
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

import { getGetOrgs } from '@/apis/org';

const orgs = ref([])

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

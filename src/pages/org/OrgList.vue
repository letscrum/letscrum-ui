<template>
  <DefaultLayout>
    <v-container fluid class="pa-6">
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="8">
          <h1 class="text-h4 font-weight-bold text-primary">{{ $t('org.list.title') }}</h1>
          <p class="text-subtitle-1 text-medium-emphasis mt-1">
            {{ $t('org.list.subtitle') }}
          </p>
        </v-col>
        <v-col cols="12" sm="4" class="text-sm-right">
          <OrgCreate>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              elevation="2"
              size="large"
            >
              {{ $t('org.list.createBtn') }}
            </v-btn>
          </OrgCreate>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col
          v-for="n in 4"
          :key="n"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-skeleton-loader
            class="mx-auto border"
            max-width="300"
            type="card-avatar, actions"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <v-row v-else-if="orgs.length > 0">
        <v-col
          v-for="(org, i) in orgs"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <OrgCard :org="org" />
        </v-col>
      </v-row>

      <v-row v-else justify="center" class="mt-12">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-domain-off</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mt-4">{{ $t('org.list.emptyTitle') }}</h3>
          <p class="text-body-2 text-grey mt-2">{{ $t('org.list.emptySubtitle') }}</p>
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { onMounted, ref } from 'vue';

import { getGetOrgs } from '@/apis/org';

const orgs = ref([])
const loading = ref(true)

onMounted(() => {
  LoadOrgs()
})

function LoadOrgs() {
  loading.value = true
  getGetOrgs({
    page: 1,
    size: 12
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      orgs.value = res.data.items;
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  });
}

// const pages = computed({
//   get() {
//     return Math.ceil(this.total / this.size);
//   }
// })
</script>

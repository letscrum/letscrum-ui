<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenOrg()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
          <v-icon icon="mdi-domain-plus" class="mr-2" color="primary" />
          <span class="text-subtitle-1 font-weight-bold">{{ $t('org.create.title') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="createOrg">
            <v-text-field
              v-model="org.name"
              :label="$t('org.create.name')"
              variant="outlined"
              density="compact"
              hint="Lowercase, no spaces — used in URLs."
              persistent-hint
              class="mb-3"
              autofocus
              required
            ></v-text-field>

            <v-text-field
              v-model="org.displayName"
              :label="$t('org.create.displayName')"
              variant="outlined"
              density="compact"
              hint="Human-friendly name shown in the UI."
              persistent-hint
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="org.description"
              :label="$t('org.create.description')"
              variant="outlined"
              density="compact"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            size="small"
            @click="isActive.value = false"
          >
            {{ $t('org.create.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            size="small"
            :loading="loading"
            :disabled="!org.name"
            @click="createOrg()"
          >
            {{ $t('org.create.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

import { ref } from 'vue';

import { postCreateOrg, getGetOrgs } from '@/apis/org';
import { useAppStore } from '@/stores/app';

const org = ref({})
const dialog = ref(false)
const loading = ref(false)
const store = useAppStore()

function onOpenOrg() {
  org.value = {}
  dialog.value = true
}

function createOrg() {
  if (!org.value.name) return; // Basic validation

  loading.value = true;
  postCreateOrg({
    name: org.value.name,
    displayName: org.value.displayName,
    description: org.value.description,
  }).then((res) => {
    if (res.status === 200) {
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
          dialog.value = false
        }
        loading.value = false;
      })
    } else {
      loading.value = false;
    }
  }).catch(() => {
    loading.value = false;
  })
}

</script>

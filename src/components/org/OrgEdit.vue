<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps" @click="onOpenEdit">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card rounded="lg" elevation="2">
        <v-progress-linear v-if="loading" indeterminate color="primary" absolute top></v-progress-linear>
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-pencil" class="mr-2" color="primary"></v-icon>
          {{ $t('org.edit.title') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="updateOrg">
            <v-text-field
              v-model="org.displayName"
              :label="$t('org.edit.displayName')"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="org.description"
              :label="$t('org.edit.description')"
              variant="outlined"
              density="compact"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >
            {{ $t('org.edit.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            :loading="loading"
            @click="updateOrg()"
          >
            {{ $t('org.edit.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { putUpdateOrg, getGetOrg } from '@/apis/org';

const emit = defineEmits(['after-update']);
const props = defineProps(['orgId']);

const org = ref({});
const dialog = ref(false);
const loading = ref(false);

function onOpenEdit() {
  loading.value = true;
  getGetOrg(props.orgId).then((res) => {
    if (res.status === 200) {
      org.value = res.data.item;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function updateOrg() {
  loading.value = true;
  putUpdateOrg(props.orgId, {
    displayName: org.value.displayName,
    description: org.value.description
  }).then((res) => {
    if (res.status === 200) {
      emit('after-update');
      dialog.value = false;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>

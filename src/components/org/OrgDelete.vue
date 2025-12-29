<template>
  <v-dialog
    v-model="dialog"
    width="400"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card rounded="lg" elevation="2">
        <v-card-title class="d-flex align-center pa-4 text-error">
          <v-icon icon="mdi-alert-circle" class="mr-2" color="error"></v-icon>
          {{ $t('org.delete.title') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          {{ $t('org.delete.confirmText') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >
            {{ $t('org.delete.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            :loading="loading"
            @click="deleteOrg()"
          >
            {{ $t('org.delete.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { deleteDeleteOrg } from '@/apis/org';

const emit = defineEmits(['after-delete']);
const props = defineProps(['orgId']);

const dialog = ref(false);
const loading = ref(false);

function deleteOrg() {
  loading.value = true;
  deleteDeleteOrg(props.orgId).then((res) => {
    if (res.status === 200) {
      emit('after-delete');
      dialog.value = false;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>

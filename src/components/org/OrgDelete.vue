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
      <v-card class="ado-border" rounded="md">
        <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
          <v-icon icon="mdi-alert-circle" class="mr-2" color="error"></v-icon>
          <span class="text-subtitle-1 font-weight-bold text-error">{{ $t('org.delete.title') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4">
          <v-alert
            type="error"
            variant="tonal"
            density="compact"
            border="start"
            class="text-body-2"
          >
            {{ $t('org.delete.confirmText') }}
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            size="small"
            @click="isActive.value = false"
          >
            {{ $t('org.delete.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            size="small"
            prepend-icon="mdi-delete-outline"
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

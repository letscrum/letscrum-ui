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
          <v-icon icon="mdi-alert" class="mr-2" color="error"></v-icon>
          <span class="text-subtitle-1 font-weight-bold text-error">{{ $t('project.delete.title') }}</span>
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
            {{ $t('project.delete.confirmText') }}
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
            {{ $t('project.delete.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            size="small"
            prepend-icon="mdi-delete-outline"
            :loading="loading"
            @click="deleteProject()"
          >
            {{ $t('project.delete.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { deleteDeleteProject } from '@/apis/project';
import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'vue-router';

const store = useAppStore();
const route = useRoute();
const router = useRouter();

const dialog = ref(false);
const loading = ref(false);

function deleteProject() {
  loading.value = true;
  deleteDeleteProject(store.org.id, route.params.projectId).then((res) => {
    if (res.status === 200) {
      if (res.data.success) {
        store.clearProject();
        store.clearSprint();
        dialog.value = false;
        router.push(`/orgs/${store.org.id}/projects`);
      }
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>

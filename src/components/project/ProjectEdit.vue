<template>
  <v-dialog
    v-model="dialog"
    width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps" @click="onOpenEdit()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card rounded="lg" elevation="2">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-pencil" class="mr-2" color="primary"></v-icon>
          {{ $t('project.edit.title') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="updateProject">
            <v-text-field
              v-model="project.displayName"
              :label="$t('project.edit.displayName')"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="project.description"
              :label="$t('project.edit.description')"
              variant="outlined"
              density="compact"
              rows="3"
              auto-grow
              class="mb-2"
            ></v-textarea>

            <v-autocomplete
              v-model:search-input="search"
              v-model="admins"
              chips
              :items="users"
              :label="$t('project.edit.admins')"
              multiple
              item-props
              no-filter
              variant="outlined"
              density="compact"
              class="mb-2"
              @update:search="searchUsers"
            >
              <template #chip="{ props, item }">
                <v-chip
                  :closable="!item.raw.owner"
                  v-bind="props"
                  :text="item.raw.name"
                  size="small"
                ></v-chip>
              </template>
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw.name"
                ></v-list-item>
              </template>
            </v-autocomplete>

            <v-autocomplete
              v-model:search-input="search"
              v-model="members"
              chips
              :items="users"
              :label="$t('project.edit.members')"
              multiple
              item-props
              no-filter
              variant="outlined"
              density="compact"
              @update:search="searchUsers"
            >
              <template #chip="{ props, item }">
                <v-chip
                  :closable="!item.raw.owner"
                  v-bind="props"
                  :text="item.raw.name"
                  size="small"
                ></v-chip>
              </template>
              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw.name"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >
            {{ $t('project.edit.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            :loading="loading"
            @click="updateProject()"
          >
            {{ $t('project.edit.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { putUpdateProject, getGetProject } from '@/apis/project';
import { getGetOrgMembers } from '@/apis/org';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const emit = defineEmits(['after-update']);
const store = useAppStore();
const route = useRoute();

const project = ref({});
const admins = ref([]);
const members = ref([]);
const users = ref([]);
const search = ref('');
const dialog = ref(false);
const loading = ref(false);

const searchUsers = val => {
  if (!val) {
    users.value = [];
    return false;
  }
  getGetOrgMembers(store.org.id).then((res) => {
    if (res.status === 200) {
      users.value = res.data.items.filter((user) => user.member.name.includes(val)).map((item) => {
        return {
          id: item.member.id,
          name: item.member.name,
          isAdmin: item.isAdmin,
          owner: item.member.id === store.user.id ? true : false
        }
      });
    }
  });
}

function onOpenEdit() {
  loading.value = true;
  dialog.value = true;
  getGetProject(store.org.id, route.params.projectId).then((res) => {
    if (res.status === 200) {
      project.value = res.data.item;

      admins.value = res.data.item.members.filter((member) => member.isAdmin).map((member) => ({
        id: member.userId,
        name: member.userName,
        isAdmin: member.isAdmin,
        owner: res.data.item.createdUser.id === member.userId ? true : false
      }));

      members.value = res.data.item.members.filter((member) => !member.isAdmin).map((member) => ({
        id: member.userId,
        name: member.userName,
        isAdmin: member.isAdmin,
        owner: res.data.item.createdUser.id === member.userId ? true : false
      }));
    }
    loading.value = false;
  });
}

function updateProject() {
  loading.value = true;

  // Prepare members list
  // Ensure admins have isAdmin=true and members have isAdmin=false
  const adminList = admins.value.map(admin => ({ ...admin, isAdmin: true }));
  const memberList = members.value.map(member => ({ ...member, isAdmin: false }));

  // Filter out owner from admin list if it's automatically added/handled by backend,
  // but based on previous code, we just send everyone.
  // However, the previous code did: admins.value.filter((admin) => { return !admin.owner })
  // Let's check if we need to exclude owner.
  // In Project.vue: admins.value = admins.value.filter((admin) => { return !admin.owner })
  // So we should probably exclude owner from the list sent to backend if the backend handles owner separately?
  // Or maybe the owner is always an admin and we just don't want to duplicate?
  // Let's follow the previous logic: remove owner from admins list before sending.

  const adminListFiltered = adminList.filter(admin => !admin.owner);

  const allMembers = [...adminListFiltered, ...memberList];

  putUpdateProject(store.org.id, route.params.projectId, {
    displayName: project.value.displayName,
    description: project.value.description,
    members: allMembers.map((member) => ({
      userId: member.id,
      userName: member.name,
      isAdmin: member.isAdmin,
    }))
  }).then((res) => {
    if (res.status === 200) {
      if (res.data.success) {
        store.setProject({
          id: res.data.id,
          displayName: project.value.displayName,
          description: project.value.description,
          myRole: project.value.myRole, // This might need to be preserved or re-fetched
        });
        emit('after-update');
        dialog.value = false;
      }
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>

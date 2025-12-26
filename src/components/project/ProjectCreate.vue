<template>
  <v-dialog
    v-model="dialog"
    width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenCreate()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card rounded="lg" elevation="2">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-folder-plus" class="mr-2" color="primary"></v-icon>
          {{ $t('project.create.title') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="createProject">
            <v-text-field
              v-model="project.name"
              :label="$t('project.create.name')"
              variant="outlined"
              density="compact"
              class="mb-2"
              required
            ></v-text-field>

            <v-text-field
              v-model="project.displayName"
              :label="$t('project.create.displayName')"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="project.description"
              :label="$t('project.create.description')"
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
              :label="$t('project.create.admins')"
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
              :label="$t('project.create.members')"
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
            {{ $t('project.create.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            :loading="loading"
            @click="createProject()"
          >
            {{ $t('project.create.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { postCreateProject } from '@/apis/project';
import { getGetOrgMembers } from '@/apis/org';
import { useAppStore } from '@/stores/app';

const emit = defineEmits(['after-create']);
const store = useAppStore();

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

function onOpenCreate() {
  project.value = {};
  admins.value = [{
    id: store.user.id,
    name: store.user.name,
    isAdmin: true,
    owner: true
  }];
  members.value = [];
  dialog.value = true;
}

function createProject() {
  if (!project.value.name) return;

  loading.value = true;

  // Prepare members list
  const adminList = admins.value.filter(admin => !admin.owner).map(admin => ({ ...admin, isAdmin: true }));
  const memberList = members.value.map(member => ({ ...member, isAdmin: false }));
  const allMembers = [...adminList, ...memberList];

  postCreateProject(store.org.id, {
    name: project.value.name,
    displayName: project.value.displayName,
    description: project.value.description,
    members: allMembers.map((member) => ({
      userId: member.id,
      userName: member.name,
      isAdmin: member.isAdmin,
    }))
  }).then((res) => {
    if (res.status === 200) {
      emit('after-create');
      dialog.value = false;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>

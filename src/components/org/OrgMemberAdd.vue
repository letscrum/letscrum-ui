<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card rounded="lg" elevation="2">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-account-plus" class="mr-2" color="primary"></v-icon>
          {{ $t('org.member.add.title') }}
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-autocomplete
            v-model="selectedUsers"
            v-model:search="search"
            :items="users"
            :loading="loading"
            item-title="name"
            item-value="id"
            :label="$t('org.member.add.searchLabel')"
            placeholder="Start typing to search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            multiple
            chips
            closable-chips
            return-object
            hide-no-data
            hide-selected
            @update:search="onSearch"
          >
            <template #chip="{ props: chipProps, item }">
              <v-chip
                v-bind="chipProps"
                :prepend-avatar="item.raw.avatar"
                :text="item.raw.name"
              ></v-chip>
            </template>

            <template #item="{ props: itemProps, item }">
              <v-list-item
                v-bind="itemProps"
                :prepend-avatar="item.raw.avatar"
                :title="item.raw.name"
                :subtitle="item.raw.email"
              ></v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="isActive.value = false"
          >
            {{ $t('org.member.add.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            :loading="submitting"
            :disabled="selectedUsers.length === 0"
            @click="addMembers()"
          >
            {{ $t('org.member.add.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getGetUsers } from '@/apis/user';
import { postAddOrgMembers } from '@/apis/org';
import { useAppStore } from '@/stores/app';

const props = defineProps(['orgId']);
const emit = defineEmits(['after-add']);
const store = useAppStore();

const dialog = ref(false);
const search = ref('');
const users = ref([]);
const selectedUsers = ref([]);
const loading = ref(false);
const submitting = ref(false);

let searchTimeout = null;

function onSearch(val) {
  if (!val || val.length < 2) return;

  if (searchTimeout) clearTimeout(searchTimeout);

  loading.value = true;
  searchTimeout = setTimeout(() => {
    getGetUsers({
      page: 1,
      size: 20,
      keyword: val
    }).then((res) => {
      if (res.status === 200) {
        // Filter out users who are already members if possible,
        // but for now just show search results
        users.value = res.data.items;
      }
      loading.value = false;
    }).catch(() => {
      loading.value = false;
    });
  }, 500);
}

function addMembers() {
  if (selectedUsers.value.length === 0) return;

  submitting.value = true;

  const oid = props.orgId || store.org.id;

  postAddOrgMembers(oid, {
    members: selectedUsers.value.map(u => ({
      userId: u.id,
      isAdmin: false
    }))
  })
    .then((res) => {
      if (res.status === 200) {
        emit('after-add');
        dialog.value = false;
        selectedUsers.value = [];
        users.value = [];
        search.value = '';
      }
      submitting.value = false;
    })
    .catch(() => {
      submitting.value = false;
    });
}

watch(dialog, (val) => {
  if (!val) {
    selectedUsers.value = [];
    users.value = [];
    search.value = '';
  }
});
</script>

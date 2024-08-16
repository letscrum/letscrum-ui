<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenCreate()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-text-field v-model="project.displayName" label="Label"></v-text-field>

          <v-textarea v-model="project.description" label="Label"></v-textarea>

          <v-autocomplete
            v-model:search-input="search"
            v-model="admins"
            chips
            :items="users"
            label="Autocomplete"
            multiple
            item-props
            no-filter
            @update:search="searchUsers"
          >
            <template #chip="{ props, item }">
              <v-chip
:closable="!item.raw.owner"
                v-bind="props"
                :text="item.raw.name"
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
            label="Autocomplete"
            multiple
            item-props
            no-filter
            @update:search="searchUsers"
          >
            <template #chip="{ props, item }">
              <v-chip
:closable="!item.raw.owner"
                v-bind="props"
                :text="item.raw.name"
              ></v-chip>
            </template>
            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.name"
              ></v-list-item>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="surface-variant"
            text="Save"
            variant="flat"
            @click="createProject()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

import { ref } from 'vue';

import { postCreateOrg, getGetOrgs } from '@/apis/org';
import { useAppStore } from '@/stores/app';

const project = ref({})
const dialog = ref(false)
const store = useAppStore()

</script>

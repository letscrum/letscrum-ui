<template>
  <v-menu v-model="menuOpen" location="bottom end" :close-on-content-click="false" offset="4">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        prepend-icon="mdi-plus"
        append-icon="mdi-chevron-down"
        variant="tonal"
        color="primary"
        size="small"
      >
        New Work Item
      </v-btn>
    </template>
    <v-card class="ado-border pa-3" rounded="md" min-width="320">
      <div class="text-overline text-medium-emphasis mb-2">Create work item</div>
      <v-select
        v-model="item.type"
        :items="[
          { title: 'Backlog item', value: 'Backlog' },
          { title: 'Bug', value: 'Bug' }
        ]"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        label="Type"
        class="mb-2"
      />
      <v-text-field
        v-model="item.title"
        density="compact"
        variant="outlined"
        hide-details
        label="Title"
        class="mb-3"
        autofocus
      />
      <div class="d-flex">
        <v-spacer />
        <v-btn variant="text" size="small" class="mr-2" @click="onCancel">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          :disabled="!item.title.trim()"
          @click="onCreateWorkItem()"
        >
          Add to top
        </v-btn>
      </div>
    </v-card>
  </v-menu>

  <!-- View Options (only on Product Backlog; Sprint pages have it in their sub-header) -->
  <MenuViewOptions v-if="route.name === 'ProductBacklog'" />

  <v-spacer></v-spacer>
</template>

<script setup>
import { ref } from 'vue'
import { postCreateWorkItem } from '@/apis/workitem';
import { useRoute } from 'vue-router';
import MenuViewOptions from '@/components/menu/MenuViewOptions.vue';

const route = useRoute()
const menuOpen = ref(false)
const item = ref({
  title: '',
  type: 'Backlog',
})
const emit = defineEmits(['afterCreate'])

function onCreateWorkItem() {
  let sprintId = "00000000-0000-0000-0000-000000000000"
  if (route.name == 'ProductBacklog') {
    sprintId = "00000000-0000-0000-0000-000000000000"
  } else {
    sprintId = route.params.sprintId
  }
  postCreateWorkItem(
    route.params.orgId,
    route.params.projectId, {
      title: item.value.title,
      sprintId: sprintId,
      type: item.value.type,
    }).then(res => {
      if (res.status === 200) {
        item.value.title = ''
        menuOpen.value = false
        emit('afterCreate')
      }
    })
}

function onCancel() {
  item.value.title = ''
  item.value.type = 'Backlog'
  menuOpen.value = false
}
</script>

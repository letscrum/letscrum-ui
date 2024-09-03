<template>
  <v-menu location="end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn style="margin-top: 6px;" v-bind="props" prepend-icon="mdi-plus" variant="text">
        New Work Item
      </v-btn>
    </template>
    <v-card>
      <select v-model="item.type">
        <option value="Backlog">Product Backlog</option>
        <option value="Bug">Bug</option>
      </select>
      <input v-model="item.title" type="text"  placeholder="Title" />
      <v-btn-group
        color="primary"
        density="comfortable"
        divided
      >
        <v-btn
          class="pe-2"
          prepend-icon="mdi-account-multiple-outline"
          variant="flat"
          @click="onCreateWorkItem()"
        >
          <div class="text-none font-weight-regular">
            Add to top
          </div>
        </v-btn>

        <v-btn
          size="small"
          icon
        >
          <v-icon icon="mdi-menu-down"></v-icon>

          <v-menu
            activator="parent"
            location="bottom end"
            transition="fade-transition"
          >
            <v-list
              density="compact"
              min-width="250"
              slim
            >
              <v-list-item
                prepend-icon="mdi-link"
                title="Add to top"
                link
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-link"
                title="Add to bottom"
                link
              ></v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-btn-group>
    </v-card>
  </v-menu>
  <v-spacer></v-spacer>
</template>

<script setup>
import { postCreateWorkItem } from '@/apis/workitem';
import { useRoute } from 'vue-router';

const route = useRoute()
const item = ref({
  title: '',
  type: 'Backlog',
})
const emit = defineEmits(['afterCreate'])

function onCreateWorkItem() {
  postCreateWorkItem(
    route.params.orgId,
    route.params.projectId, {
      title: item.value.title,
      sprintId: route.params.sprintId,
      type: item.value.type,
    }).then(res => {
      if (res.status === 200) {
        emit('afterCreate')
      }
    })
}

</script>

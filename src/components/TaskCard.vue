<template>
  <v-sheet border rounded class="pa-1 ma-1" style="border-left-color: rgb(242, 203, 29); border-left-width: 3px; max-width: 180px;">
    <input type="text" class="task-text" :text="props.task.title">
    <v-combobox
      v-model="assign"
      :items="users"
      density="compact"
      variant="outlined"
      class="task-text"
      :value="assign.name"
      :text="assign.name"
    ></v-combobox>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['task', 'status']);

const users = ref([{
  name: 'User 1',
}, {
  name: 'User 2',
}, {
  name: 'User 3',
}]);
const assign = ref({
  name: 'User 1',
});
</script>

<style scoped>

.task-text {
  font-size: 12px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.task-text:hover {
  border-color: silver;
}

</style>

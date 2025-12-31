<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 2 : 0"
      border
      variant="flat"
      class="h-100 transition-swing cursor-pointer"
      rounded="lg"
      @click="onEnter"
    >
      <v-card-item>
        <template #prepend>
          <v-avatar
            size="48"
            rounded="lg"
            color="primary"
            variant="tonal"
          >
            <v-icon color="primary" icon="mdi-run-fast" size="large"></v-icon>
          </v-avatar>
        </template>
        <v-card-title class="text-h6 font-weight-bold pt-0">{{ sprint.name }}</v-card-title>
        <v-card-subtitle>
          {{ new Date(sprint.startDate * 1000).toLocaleDateString() }} -
          {{ new Date(sprint.endDate * 1000).toLocaleDateString() }}
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pt-2">
        <v-chip
          :color="sprint.status === 'CURRENT' ? 'success' : 'default'"
          size="small"
          variant="tonal"
          class="mb-2"
        >
          {{ sprint.status }}
        </v-chip>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          variant="text"
          color="primary"
          size="small"
        >
          {{ $t('project.detail.sprints.enter') }}
        </v-btn>
        <v-spacer></v-spacer>

        <SprintEdit :sprint-id="sprint.id" @after-edit="$emit('refresh')">
          <v-btn icon="mdi-pencil" size="small" variant="text" color="grey"></v-btn>
        </SprintEdit>

        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click.stop="$emit('delete', sprint.id)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup>
const props = defineProps(['sprint']);
const emit = defineEmits(['enter', 'delete', 'refresh']);

function onEnter() {
    emit('enter', props.sprint);
}
</script>

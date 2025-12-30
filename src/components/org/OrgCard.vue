<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 2 : 0"
      border
      variant="flat"
      class="mx-auto transition-swing cursor-pointer h-100"
      rounded="lg"
      @click="onLoadOrg"
    >
      <v-card-item>
        <template #prepend>
          <v-avatar
            size="48"
            rounded="lg"
            :color="uuidToColor(org.id)"
            variant="tonal"
          >
            <span class="text-h6 font-weight-bold">
              {{ (org.displayName || org.name).substring(0, 1).toUpperCase() }}
            </span>
          </v-avatar>
        </template>
        <v-card-title class="text-h6 font-weight-bold pt-0">
          {{ org.displayName || org.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ org.name }}
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pt-2">
        <div class="text-body-2 text-medium-emphasis text-truncate-2">
          {{ org.description || 'No description available' }}
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-chip
          size="small"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-account-group"
        >
          {{ org.members ? org.members.length : 0 }} {{ $t('org.card.members') }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          icon="mdi-arrow-right"
          size="small"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script setup>
import { getGetOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { uuidToColor } from '@/utils/utils'

const store = useAppStore()
const router = useRouter()

const props = defineProps(['org'])

const org = ref(props.org)

function onLoadOrg() {
  getGetOrg(org.value.id).then((res) => {
    if (res.status === 200) {
      store.setOrg(res.data.item);
      if (res.data.item.id) {
        router.push(`/orgs/${res.data.item.id}/projects`);
      } else {
        router.push('/orgs');
      }
    }
  });
}
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 2 : 0"
      class="ado-border cursor-pointer h-100 d-flex flex-column"
      rounded="md"
      @click="onLoadOrg"
    >
      <div class="d-flex align-start pa-3" style="gap: 12px;">
        <v-avatar
          size="36"
          rounded="md"
          :color="uuidToColor(org.id)"
        >
          <span class="text-subtitle-2 font-weight-bold text-white">
            {{ (org.displayName || org.name).substring(0, 1).toUpperCase() }}
          </span>
        </v-avatar>
        <div style="min-width: 0;" class="flex-grow-1">
          <div class="text-body-1 font-weight-bold text-truncate">
            {{ org.displayName || org.name }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">{{ org.name }}</div>
        </div>
        <v-icon size="small" :color="isHovering ? 'primary' : undefined" :class="isHovering ? '' : 'text-medium-emphasis'">mdi-arrow-right</v-icon>
      </div>

      <div class="px-3 pb-2 flex-grow-1">
        <div class="text-body-2 text-medium-emphasis text-truncate-2" style="min-height: 36px;">
          {{ org.description || 'No description' }}
        </div>
      </div>

      <v-divider />
      <div class="d-flex align-center px-3 py-2">
        <v-icon size="x-small" class="mr-1 text-medium-emphasis">mdi-account-group-outline</v-icon>
        <span class="text-caption text-medium-emphasis">
          {{ org.members ? org.members.length : 0 }} {{ $t('org.card.members') }}
        </span>
      </div>
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


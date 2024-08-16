<template>
  <v-menu location="end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn class="mt-2" v-bind="props" prepend-icon="mdi-plus" variant="text">
        New Work Item
      </v-btn>
    </template>
    <v-card>
      <select>
        <option value="1">Product Backlog</option>
        <option value="2">Bug</option>
      </select>
      <input type="text" placeholder="Title" />
      <v-btn-group
        color="primary"
        density="comfortable"
        divided
      >
        <v-btn
          class="pe-2"
          prepend-icon="mdi-account-multiple-outline"
          variant="flat"
        >
          <div class="text-none font-weight-regular">
            Add to top
          </div>

          <v-dialog activator="parent" max-width="500">
            <template v-slot:default="{ isActive }">
              <v-card rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div class="text-h5 text-medium-emphasis ps-2">
                    Invite John to connect
                  </div>

                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-title>

                <v-divider class="mb-4"></v-divider>

                <v-card-text>
                  <div class="text-medium-emphasis mb-4">
                    Invite collaborators to your network and grow your connections.
                  </div>

                  <div class="mb-2">Message (optional)</div>

                  <v-textarea
                    :counter="300"
                    class="mb-2"
                    rows="2"
                    variant="outlined"
                    persistent-counter
                  ></v-textarea>

                  <div class="text-overline mb-2">💎 PREMIUM</div>

                  <div class="text-medium-emphasis mb-1">
                    Share with unlimited people and get more insights about your network. Try Premium Free for 30 days.
                  </div>

                  <v-btn
                    class="text-none font-weight-bold ms-n4"
                    color="primary"
                    text="Retry Premium Free"
                    variant="text"
                  ></v-btn>
                </v-card-text>

                <v-divider class="mt-2"></v-divider>

                <v-card-actions class="my-2 d-flex justify-end">
                  <v-btn
                    class="text-none"
                    rounded="xl"
                    text="Cancel"
                    @click="isActive.value = false"
                  ></v-btn>

                  <v-btn
                    class="text-none"
                    color="primary"
                    rounded="xl"
                    text="Send"
                    variant="flat"
                    @click="isActive.value = false"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
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
</template>

<script setup>

</script>

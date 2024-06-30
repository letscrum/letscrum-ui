<template>
  <div class="ma-2">
    <v-row no-gutters>
      <v-col>
        <h2 class="pa-1">Project List</h2>
      </v-col>
      <v-col>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined class="float-right ma-1" tile v-bind="attrs" v-on="on">
              <v-icon left>
                mdi-plus
              </v-icon>
              New Project
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Create Project</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Name"
                      required
                      v-model="project.displayName"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      label="Description"
                      v-model="project.description"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="members"
                      :items="users"
                      chips
                      label="Members"
                      item-text="name"
                      item-value="id"
                      multiple
                      :search-input.sync="search"
                      cache-items
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="remove(data.item)"
                        >
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                      <template v-slot:item="data">
                        <template>
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                            <v-list-item-subtitle v-html="data.item.email"></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="dialog = false">
                Close
              </v-btn>
              <v-btn text @click="onCreateProject">
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-divider class="my-1"></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="4" class="pa-1" v-for="(project, i) in projects" :key="i">
        <project-list-card :project="project"></project-list-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="pages"
    ></v-pagination>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { getGetProjects, postCreateProject } from '@/apis/project';
import { getUsers } from '@/apis/user';

export default {
  name: 'ProjectList',
  components: {
    ProjectListCard: () => import('@/components/project/ListCard.vue')
  },
  computed: {
    pages: {
      get() {
        return Math.ceil(this.total / this.size);
      }
    }
  },
  watch: {
    page(val) {
      this.onLoadProjects(val);
    },
    search(val) {
      return val && val !== this.select && this.querySelections(val);
    }
  },
  data: () => ({
    size: 12,
    page: 1,
    total: 0,
    projects: [],
    project: {
      displayName: '',
      description: ''
    },
    loading: false,
    dialog: false,
    searchTimer: null,
    members: [],
    users: [],
    search: null
  }),
  created() {
    this.clearProject();
    this.onLoadProjects(1);
  },
  methods: {
    ...mapMutations(['clearProject']),
    onLoadProjects(currentPage) {
      getGetProjects({
        page: currentPage,
        size: this.size
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.projects = res.data.items;
          this.page = res.data.pagination.page;
          this.total = res.data.pagination.total;
        }
      });
    },
    querySelections(v) {
      this.loading = true;
      clearInterval(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        getUsers({
          page: 1,
          size: 999,
          keyword: (v || '').toLowerCase()
        }).then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.users = res.data.items;
          }
        });
      }, 500);
    },
    remove(item) {
      const index = this.members.indexOf(item.id);
      if (index >= 0) this.members.splice(index, 1);
    },
    onCreateProject() {
      postCreateProject({
        display_name: this.project.displayName,
        description: this.project.description,
        members: this.members
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.dialog = false;
          this.onLoadProjects(1);
        }
      });
    }
  }
};
</script>

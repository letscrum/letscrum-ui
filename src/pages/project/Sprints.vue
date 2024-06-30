<template>
  <div class="ma-2">
    <v-row no-gutters>
      <v-col>
        <h2>{{ sprint.name }}</h2>
      </v-col>
      <v-col>
        <v-menu offset-y bottom left min-width="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" plain tile large class="float-right">
              {{ sprint.name }}
              <v-icon right>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-virtual-scroll height="350" item-height="64" :items="sprints">
              <template v-slot:default="{ item }">
                <v-list-item
                  :to="'/projects/' + project.id + '/sprints/' + item.id"
                  two-line
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(item.startDate * 1000).toISOString().substr(0, 10) }}
                      - {{ new Date(item.endDate * 1000).toISOString().substr(0, 10) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text>
                      <v-chip
                        :color="item.status === 'CURRENT' ? 'primary' : ''"
                        small
                      >
                        {{ item.status }}
                      </v-chip>
                    </v-list-item-action-text>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-list>
          <v-list>
            <v-dialog v-model="dialog" persistent max-width="600">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item v-bind="attrs" v-on="on">
                  <v-list-item-icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>New Sprint</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Create Sprint</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          label="Name"
                          required
                          v-model="sprintName"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="rangeDate"
                              label="Picker without buttons"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            no-title
                            range
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12">
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn text @click="onCreateSprint">
                    Create
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getGetSprints, postCreateSprint } from '@/apis/sprint';

export default {
  name: 'ProjectSprints',
  data: () => ({
    date: [],
    sprintName: '',
    startDate: '',
    endDate: '',
    rangeDate: null,
    menu: false,
    dialog: false,
    sprints: []
  }),
  watch: {
    date(val) {
      this.startDate = val[0] ? val[0] : '';
      this.endDate = val[1] ? val[1] : '';
      if (val[0] > val[1]) {
        this.startDate = val[1] ? val[1] : '';
        this.endDate = val[0] ? val[0] : '';
      }
      this.rangeDate = `${this.startDate} - ${this.endDate}`;
    }
  },
  computed: {
    ...mapGetters(['project', 'sprint'])
  },
  created() {
    this.onLoadSprints();
  },
  methods: {
    ...mapMutations(['setSprint']),
    onCreateSprint() {
      postCreateSprint(this.project.id, {
        name: this.sprintName,
        start_date: Math.floor(new Date(this.startDate).getTime() / 1000),
        end_date: Math.floor(new Date(this.endDate).getTime() / 1000)
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log(res.data);
          this.onLoadSprints();
          this.dialog = false;
        }
      });
    },
    onLoadSprints() {
      getGetSprints(this.project.id, {
        page: 1,
        size: 999
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.sprints = res.data.items;
        }
      });
    },
    onSetSprint(id, name, startDate, endDate) {
      this.setSprint({
        id,
        name,
        startDate,
        endDate
      });
    }
  }
};
</script>

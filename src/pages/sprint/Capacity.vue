<template>
  <div>
    <v-tabs>
      <v-tab to="taskboard">Taskboard</v-tab>
      <v-tab to="backlog">Backlog</v-tab>
      <v-tab to="capacity">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <v-btn tile text small style="margin-top: 10px;">
        <v-icon left>
          mdi-plus
        </v-icon>
        Add Member
      </v-btn>
      <v-btn tile text small style="margin-top: 10px;">
        <v-icon left>
          mdi-content-save
        </v-icon>
        Save
      </v-btn>
      <v-btn tile text small style="margin-top: 10px;">
        <v-icon left>
          mdi-undo-variant
        </v-icon>
        Undo
      </v-btn>
      <v-menu offset-y bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all project members</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-arrow-right
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all members from last sprint</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-order-bool-ascending
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense>
            <v-list-item-subtitle>Side Panel</v-list-item-subtitle>
          </v-list-item>
          <v-list-item dense @click="workDetail = !workDetail">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-briefcase
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Work details</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Role
                </th>
                <th class="text-left">
                  Capacity per day
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="member in sprintMembers"
                :key="member.name"
              >
                <td>
                  <v-list-item>
                    <v-list-item-avatar color="red" size="30">
                      <span class="white--text text-h6">
                        {{ member.userName.substring(0, 1).toUpperCase() }}
                      </span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ member.userName }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>
                <td>
                  <v-select
                    class="mt-0 pt-0"
                    :items="roles"
                    hide-details
                    dense
                    style="width: 180px;"
                  ></v-select>
                </td>
                <td>
                  <v-text-field
                    :value="member.capacity"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    dense
                    type="number"
                    style="width: 120px;"
                  ></v-text-field>
                </td>
                <td>
                  <v-btn text icon>
                    <v-icon>
                      mdi-close
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col v-if="workDetail" cols="3">
        <v-card flat tile>
          <v-card-title>
            <span class="text-h5">Work Details</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="workDetail = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getGetSprintMembers } from '@/apis/sprint';

export default {
  name: 'SprintCapacity',
  data: () => ({
    sprintMembers: [],
    roles: ['Development', 'Testing', 'Documentation'],
    workDetail: false
  }),
  computed: {
    ...mapGetters(['project', 'sprint'])
  },
  created() {
    this.onLoadSprintMembers();
  },
  methods: {
    onLoadSprintMembers() {
      getGetSprintMembers(this.project.id, this.sprint.id, {
        page: 1,
        size: 999
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          this.sprintMembers = res.data.items;
        }
      });
    },
    onSetRole(userId, role) {
      this.sprintMembers.forEach((m) => {
        if (m.userId === userId) {
          // eslint-disable-next-line no-param-reassign
          m.role = role;
        }
      });
      console.log(this.sprintMembers);
    }
  }
};
</script>

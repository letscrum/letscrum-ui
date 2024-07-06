<template>
  <div>
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
import { getGetSprintMembers } from '@/apis/sprint';

export default {
  name: 'SprintCapacity',
  data: () => ({
    sprintMembers: [],
    roles: ['Development', 'Testing', 'Documentation'],
    workDetail: false
  }),
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

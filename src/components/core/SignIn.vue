<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-toolbar-title>Login form</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="isDialog != undefined" @click="$emit('close-dialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="Email Address"
          name="email"
          prepend-icon="mdi-email"
          type="text"
          v-model="form.email"
          :rules="emailRules"
          required
        />
        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="form.password"
          :rules="passwordRules"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn block :disabled="!valid" :loading="loading" @click="onSignIn">{{
        $t("signIn.signInBtn")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { postSignIn } from '@/apis/index';

export default {
  name: 'CoreSignIn',
  props: ['isDialog'],

  data: () => ({
    valid: true,
    loading: false,
    form: {
      email: '',
      password: ''
    },
    emailRules: [],
    passwordRules: []
  }),
  created() {
    this.emailRules = [
      (v) => !!v || this.$i18n.t('signIn.emailRuleRequired'),
      (v) => /.+@.+/.test(v) || this.$i18n.t('signIn.emailRuleFormat')
    ];
    this.passwordRules = [
      (v) => !!v || this.$i18n.t('signIn.passwordRuleRequired'),
      (v) => v.length >= 6 || 'more then 6'
    ];
  },
  computed: {
    ...mapGetters(['accessToken']),
    username() {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username;
    }
  },
  methods: {
    ...mapMutations(['signIn']),
    onSignIn() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        postSignIn({
          name: 'admin',
          password: 'aaaaaa'
        }).then((res) => {
          if (res.status === 200) {
            this.signIn({
              id: res.data.item.id,
              name: res.data.item.name,
              email: res.data.item.email,
              isSuperAdmin: res.data.item.isSuperAdmin,
              accessToken: res.data.item.token.accessToken,
              refreshToken: res.data.item.token.refreshToken
            });
            this.$router.go('/projects');
            this.loading = false;
          }
        }).catch(() => {
          this.loading = false;
        });
      }
    }
  }
};
</script>

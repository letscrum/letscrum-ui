<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-toolbar-title>Login form</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="isDialog != undefined" icon @click="$emit('close-dialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="form.email"
          label="Email Address"
          name="email"
          prepend-icon="mdi-email"
          type="text"
          :rules="emailRules"
          required
        />
        <v-text-field
          id="password"
          v-model="form.password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          :rules="passwordRules"
          required
        />
        <v-text-field
          id="rePassword"
          v-model="form.rePassword"
          label="Confirm Password"
          name="rePassword"
          prepend-icon="mdi-lock"
          type="password"
          :rules="rePasswordRules"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn block :disabled="!valid" :loading="loading" @click="signUp">{{
        $t("signUp.signUpBtn")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';

export default {
  name: 'CoreSignUp',
  props: ['isDialog'],

  data: () => ({
    agreement: false,
    bio:
      'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts',
    dialog: false,
    email: undefined,
    // form: false,
    isLoading: false,
    password: undefined,
    phone: undefined,

    valid: true,
    loading: false,
    form: {
      email: '',
      password: '',
      rePassword: ''
    },
    emailRules: [],
    passwordRules: [],
    rePasswordRules: []
  }),
  created() {
    this.emailRules = [
      (v) => !!v || 'no email',
      (v) => /.+@.+/.test(v) || 'bad email'
    ];
    this.passwordRules = [
      (v) => !!v || 'no pwd',
      (v) => v.length >= 6 || 'more then 6'
    ];
    this.rePasswordRules = [
      (v) => !!v || 'no repwd',
      (v) => v.length >= 6 || 'more then 6',
      (v) => v === this.form.password || 'same as pwd'
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
    goBack() {
      // eslint-disable-next-line no-unused-expressions
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    signUp() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$store.commit('signIn', {
          id: 1,
          clientId: 'letscrum-vue',
          username: 'letscrum-vue',
          email: 'letscrum-vue@letscrum-vue.com',
          phone: '123',
          accessToken: 'token',
          refreshToken: 'token'
        });
        this.$store.commit('setNickname', 'Vue First');
        this.$store.commit('setAvatarUrl', '');
        this.loading = false;
        this.$router.push('/');
      }
    }
  }
};
</script>

<template>
  <v-layout row>
    <v-flex xs6 offset-xs3>
      <panel title="Register">
        <v-form v-model="valid" lazy-validation>
          <v-text-field label="Email" v-model="email" :rules="emailRules" type="email" required></v-text-field>
          <br>
          <v-text-field label="Password" type="password" :rules="passwordRules" v-model="password"></v-text-field>
          <br>
          <v-text-field
            label="Confirm Password"
            type="password"
            :rules="confirmPasswordRules"
            v-model="confirmpassword"
          ></v-text-field>
        </v-form>
        <br>
        <div class="error1" v-html="error"/>
        <br>
        <v-btn color="cyan" :dark="valid" round :disabled="!valid" @click="register">Register</v-btn>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from "@/services/AuthenticationService";
import Panel from "@/components/Panel";
export default {
  data() {
    return {
      valid: true,
      email: "",
      password: "",
      confirmpassword: "",
      error: null,
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [
        v =>
          /(?=.*[a-z])/.test(v) ||
          "Password must contain 1 lower case character",
        v =>
          /(?=.*[A-Z])/.test(v) ||
          "Password must contain 1 upper case character",
        v => /(?=.*[0-9])/.test(v) || "Password must contain 1 number",
        v =>
          /(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./-])/.test(v) ||
          "Password must contain 1 punctuation",
        v =>
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./-]).{8,16}$/.test(
            v
          ) || "Password length must be in the range [8, 16]"
      ],
      confirmPasswordRules: [
        v => v == this.password || "Password must be the same"
      ]
    };
  },
  methods: {
    async register() {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        });
        this.$store.dispatch("setToken", response.data.token);
        this.$store.dispatch("setUser", response.data.user);
      } catch (err) {
        this.error = err.response.data.error;
        console.log(this.error);
      }
    }
  },
  components: {
    Panel
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.error1 {
  color: red;
}
</style>

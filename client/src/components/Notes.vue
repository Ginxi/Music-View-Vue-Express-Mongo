<template>
  <v-layout row>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Notes</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-form name="register-form" ref="form">
            <v-text-field label="Email" v-model="email"></v-text-field>
            <br>
            <v-text-field
              label="Password"
              type="password"
              :rules="passwordRules"
              v-model="password"
            ></v-text-field>
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
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <v-toolbar fixed dark class="cyan">
    <v-toolbar-title class="mr-4">TabTracker</v-toolbar-title>
    <v-toolbar-items>
       <v-btn flat dark @click="navigateTo({name: 'songs'})">Browse</v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn
        flat
        dark
        v-if="!$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'login'})"
      >Log in</v-btn>
      <v-btn
        flat
        dark
        v-if="!$store.state.isUserLoggedIn"
        @click="navigateTo({name: 'register'})"
      >Sign Up</v-btn>
      <v-btn flat dark v-if="$store.state.isUserLoggedIn" @click="logout">Log Out</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    logout() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$router.push({
        name: "root"
      });
    }
  }
};
</script>

<style scoped>
</style>

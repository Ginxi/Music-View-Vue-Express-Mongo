<template>
  <v-layout>
    <v-flex xs4>
      <panel title="Song Metadata">
        <v-form v-model="valid" lazy-validation>
          <v-text-field label="Title" required :rules="titleRules" v-model="song.title"></v-text-field>
          <v-text-field label="Artist" v-model="song.artist"></v-text-field>
          <v-text-field label="Genre" v-model="song.genre"></v-text-field>
          <v-text-field label="Album" v-model="song.album"></v-text-field>
          <v-text-field label="Album Image Url" v-model="song.albumImageUrl"></v-text-field>
          <v-text-field label="YouTube ID" v-model="song.youtubeId"></v-text-field>
          <!-- <v-text-field label="Title" v-model="title"></v-text-field> -->
        </v-form>
      </panel>
    </v-flex>
    <v-flex xs8>
      <panel title="Song Structure" class="ml-2">
        <v-text-field label="Tab" multi-line v-model="song.tab"></v-text-field>
        <v-text-field label="Lyrics" multi-line v-model="song.lyrics"></v-text-field>
      </panel>
      <v-btn :dark="valid" round class="cyan" @click="save" :disabled="!valid">Save Song</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import Panel from "@/components/Panel";
import SongsService from "@/services/SongsService";
export default {
  data() {
    return {
      valid: true,
      song: {
        title: null,
        artist: null,
        genre: null,
        album: null,
        albumImageUrl: null,
        youtubeId: null,
        lyrics: null,
        tab: null
      },
      titleRules: [v => !!v || "Title is required"]
    };
  },
  components: {
    Panel
  },
  async mounted() {
    try {
      const songId = this.$store.state.route.params.songId;
      this.song = (await SongsService.show(songId)).data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async save() {
      const songId = this.$store.state.route.params.songId;
      try {
        await SongsService.put(this.song);
        this.$router.push({
          name: "song",
          params: {
            songId: songId
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

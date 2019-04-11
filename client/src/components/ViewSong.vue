<template>
  <div>
    <v-layout class="song">
      <v-flex xs6>
        <panel title="Song Metadata" style="height: 399px">
          <v-layout>
            <v-flex xs6>
              <div class="song-title">{{song.title}}</div>
              <div class="song-artist">{{song.artist}}</div>
              <div class="song-genre">{{song.genre}}</div>
              <v-btn
                dark
                round
                class="cyan"
                @click="navigateTo({name: 'song-edit', params: { songId: song._id} })"
              >Edit</v-btn>
            </v-flex>
            <v-flex xs6>
              <img
                class="album-image"
                :src="!song.albumImageUrl ? '../assets/logo.png' : song.albumImageUrl"
                :onerror="logo"
              >
              <br>
              {{song.album}}
            </v-flex>
          </v-layout>
        </panel>
      </v-flex>
      <v-flex xs6 class="ml-2">
        <panel title="YouTube Video">
          <youtube
            v-if="song.youtubeId && song.youtubeId.length > 0"
            :video-id="song.youtubeId"
            player-height="330"
          />
        </panel>
      </v-flex>
    </v-layout>
    <v-layout class="mt-2">
      <v-flex xs6>
        <panel title="Tabs">
          <textarea class="textarea" readonly v-model="song.tab"></textarea>
        </panel>
      </v-flex>
      <v-flex xs6 class="ml-2">
        <panel title="Lyrics">
          <textarea class="textarea" readonly v-model="song.lyrics"></textarea>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import SongsService from "@/services/SongsService";
export default {
  data() {
    return {
      song: {},
      logo: 'this.src="' + require("../assets/logo.png") + '"'
    };
  },
  methods: {
      navigateTo(route) {
          this.$router.push(route)
      }
  },
  components: {
    Panel
  },
  async mounted() {
    const songId = this.$store.state.route.params.songId;
    this.song = (await SongsService.show(songId)).data;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song {
  height: 430px;
  overflow: hidden;
}
.song-title {
  font-size: 30px;
}

.song-artist {
  font-size: 24px;
}

.song-genre {
  font-size: 18px;
}

.album-image {
  width: 70%;
  margin: 0 auto;
}
.textarea {
  width: 100%;
  font-family: monospace;
  border: none;
  height: 600px;
  border-style: none;
  border-color: transparent;
  overflow: auto;
  padding: 40px;
  resize: none;
}
</style>

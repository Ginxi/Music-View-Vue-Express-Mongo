<template>
  <v-layout row>
    <v-flex xs6 offset-xs3>
      <panel title="Search" class="mb-2">
        <v-text-field label="Search by song title, artist, album, or genre" v-model="search"></v-text-field>
      </panel>
      <panel title="Songs">
        <v-btn
          slot="action"
          light
          fab
          medium
          absolute
          right
          middle
          class="cyan accent-2"
          @click="navigateTo({name: 'songs-create'})"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <div class="song" v-for="song in songs" :key="song.id">
          <v-card>
            <v-layout>
              <v-flex xs6>
                <div class="song-title">{{song.title}}</div>
                <div class="song-artist">{{song.artist}}</div>
                <div class="song-genre">{{song.genre}}</div>
                <v-btn
                  dark
                  round
                  class="cyan"
                  @click="navigateTo({name: 'song', params: { songId: song._id} })"
                >View</v-btn>
              </v-flex>
              <v-flex xs6>
                <img
                  class="album-image"
                  :src="!song.albumImageUrl ? '../assets/logo.png' : song.albumImageUrl"
                  :onerror="logo"
                >
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Panel from "@/components/Panel";
import SongsService from "@/services/SongsService";
import _ from 'lodash'
export default {
  data() {
    return {
      songs: null,
      logo: 'this.src="' + require("../assets/logo.png") + '"',
      search: ""
    };
  },
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "songs"
      };
      if (this.search != "") {
        route.query = {
          search: this.search
        };
      }
      this.$router.push(route);
    }, 700),
    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.search = value;
        this.songs = (await SongsService.index(value)).data;
      }
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  },
  components: {
    Panel
  },
  // async mounted() {
  //   this.songs = (await SongsService.index()).data;
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.song {
  padding: 20px;
  height: 330px;
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
</style>

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
              <v-btn
                dark
                round
                v-if="isUserLoggedIn && !bookmark"
                class="cyan"
                @click="setBookmark"
              >Bookmark</v-btn>
              <v-btn
                dark
                round
                v-if="isUserLoggedIn && bookmark"
                class="cyan"
                @click="unbookmark"
              >Unbookmark</v-btn>
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
import {mapState} from "vuex";
import BookmarksService from "@/services/BookmarksService";
export default {
  data() {
    return {
      song: {},
      bookmark: null,
      logo: 'this.src="' + require("../assets/logo.png") + '"',
    };
  },
  computed: {
    ...mapState(['isUserLoggedIn', 'user'])
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    async setBookmark() {
      try {
       this.bookmark =  (await BookmarksService.post({
          songId: this.songId,
          userId: this.user._id
        })).data;
        console.log(this.bookmark)
      } catch (err) {
        console.log(err);
      }
    },
    async unbookmark() {
      try {
        console.log(this.bookmark)
        await BookmarksService.delete(this.bookmark._id);
        this.bookmark = null
      } catch (err) {
        console.log(err);
      }
    }
  },
  components: {
    Panel
  },
  async mounted() {
    try {
      this.songId = this.$store.state.route.params.songId;
      this.song = (await SongsService.show(this.songId)).data;
      if (this.isUserLoggedIn) {
        this.bookmark = (await BookmarksService.index({
          songId: this.songId,
          userId: this.user._id
        })).data;
      }
    } catch (err) {
      console.log(err);
    }
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

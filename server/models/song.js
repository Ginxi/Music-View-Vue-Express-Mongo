const mongoose = require('mongoose')
const songSchema = mongoose.Schema({
    title: { type: String, required: true},
    artist: String,
    genre: String,
    album: String,
    albumImageUrl: String,
    youtubeId: String,
    lyrics: String,
    tab: String
}, { collection: 'mysong' })

const Song = module.exports = mongoose.model('song', songSchema)

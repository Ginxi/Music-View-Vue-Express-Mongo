const mongoose = require('mongoose')
const bookmarkSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    songId: {  type: mongoose.Schema.Types.ObjectId, ref: 'Song'}
}, { collection: 'mybookmark' })
bookmarkSchema.index({ "userId": 1, "songId": 1}, { "unique": true });
const Bookmark = module.exports = mongoose.model('bookmark', bookmarkSchema)

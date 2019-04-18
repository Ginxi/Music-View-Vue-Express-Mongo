const mongoose = require('mongoose')
const bookmarkSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, { collection: 'mybookmark' }, { versionKey: false, timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })
bookmarkSchema.index({ "userId": 1, "songId": 1 }, { "unique": true });
const Bookmark = module.exports = mongoose.model('bookmark', bookmarkSchema)

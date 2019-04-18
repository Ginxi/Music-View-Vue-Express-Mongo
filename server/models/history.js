const mongoose = require('mongoose')
const historySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    songId: {  type: mongoose.Schema.Types.ObjectId, ref: 'Song'},
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, { collection: 'myhistory' }, { versionKey: false, timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } })
historySchema.index({ "userId": 1, "songId": 1}, { "unique": true });
const History = module.exports = mongoose.model('history', historySchema)

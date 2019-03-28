const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String
}, { collection: 'myuser' })

const User = module.exports = mongoose.model('user', userSchema);
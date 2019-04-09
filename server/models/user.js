const mongoose = require('mongoose')
// const Promise = require('bluebird')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 8

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String
}, { collection: 'myuser' })

userSchema.pre('save', function (next) {
    var user = this
    if (!user.isModified('password')) return next()
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const User = module.exports = mongoose.model('user', userSchema)

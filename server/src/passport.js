const passport = require('passport')
const user = require('../models/user')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

passport.use(
    new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'secret'
    }, async function (jwtPayload, done) {
        try {
            await user.findOne({_id: jwtPayload._id}, (err, user) => {
                if (err) {
                    return done(new Error(), false)
                } else {
                    return done(null, user)
                }
            })
        } catch (err) {
            return done(new Error(), false)
        }
    }
))

module.exports = null
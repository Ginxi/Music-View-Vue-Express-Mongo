const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const user = require('../models/user')
const song = require('../models/song')
const SongsController = require('../controllers/SongsController')
// const Joi = require('Joi')
const jwt = require('jsonwebtoken')
// const morgan = require('morgan')

const app = express()
// app.use(morgan('combined'))
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true })
app.use(bodyParser.json())
app.use(cors())

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, process.env.JWT_SECRET || 'secret', {
        expiresIn: ONE_WEEK
    })
}

app.post('/register', async (req, res) => {
    user.create({ email: req.body.email, password: req.body.password }, (err, user) => {
        if (err) {
            res.status(400).send({ error: 'This email account is already in use.' })
        } else {
            const userJson = user.toJSON()
            res.send({ user: userJson, token: jwtSignUser(userJson) })
        }
    })
})

app.post('/login', async (req, res) => {
    user.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            res.status(500).send({ error: 'An error has occured when login.' })
        } else {
            if (!user) {
                res.status(403).send({ error: 'User not found.' })
            } else {
                const isPasswordValid = await user.comparePassword(req.body.password)
                if (!isPasswordValid) {
                    res.status(403).send({ error: 'Your email address or password is incorrect.' })
                } else {
                    const userJson = user.toJSON()
                    res.send({ user: userJson, token: jwtSignUser(userJson) })
                }
            }
        }
    })
})

app.post('/songs', async (req, res) => {
    song.create(req.body, (err, song) => {
        if (err) {
            res.status(500).send({ error: 'An error has occured when trying to create the song' })
        } else {
            res.send(song)
        }
    })
})
app.get('/songs', async (req, res) => {
    song
    .find()
    .limit(10)
    .exec(function (err, songs) {
        if (err) {
            res.status(500).send({error: "An error has occured when trying to fetch the songs."})
        } else {
            res.send(songs)
        }
    })
})
app.get('/songs/:songId', async (req, res) => {
    song
    .findById(req.params.songId)
    .exec(function (err, song) {
        if (err) {
            res.status(500).send({error: "An error has occured when trying to fetch the song."})
        } else {
            res.send(song)
        }
    })
})

app.listen(process.env.PORT || 8081)
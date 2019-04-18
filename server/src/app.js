const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const user = require('../models/user')
const song = require('../models/song')
const bookmark = require('../models/bookmark')
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
            res.status(500).send({ error: 'This email account is already in use.' })
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
    let songs = null
    const search = req.query.search
    if (search) {
        songs = {
            $or: [
                {title: { '$regex' : search, '$options' : 'i' }},
                {artist: { '$regex' : search, '$options' : 'i' }},
                {genre: { '$regex' : search, '$options' : 'i' }}
            ]
        }
    }
    song
        .find(songs)
        .limit(10)
        .exec(function (err, songs) {
            if (err) {
                res.status(500).send({ error: "An error has occured when trying to fetch the songs." })
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
                res.status(500).send({ error: "An error has occured when trying to fetch the song." })
            } else {
                res.send(song)
            }
        })
})
app.put('/songs/:songId', async (req, res) => {
    song.findOneAndUpdate({ _id: req.params.songId }, req.body, (err, song) => {
        if (err) {
            res.status(500).send({ error: "An error has occured when trying to update the song." })
        } else {
            res.send(song)
        }
    })
})

app.get('/bookmarks', async (req, res) => {
    bookmark
        .findOne(req.body)
        .exec(function (err, bookmark) {
            if (err) {
                res.status(500).send({ error: "An error has occured when trying to fetch the song." })
            } else {
                res.send(bookmark)
            }
        })
})

app.post('/bookmarks', async (req, res) => {
    bookmark.create(req.body.params, (err, bookmark) => {
        if (err) {
            res.status(500).send({error: "An error has occured when creating the bookmark."})
        } else {
            res.send(bookmark)
        }
    })
})

app.delete('/bookmarks/:bookmarkId', async (req, res) => {
    bookmark.findByIdAndRemove(req.params.bookmarkId, (err, todo) => {
        if (err) {
            res.status(500).send({error: "An error has occured when deleting the bookmark."})
        } else {
            res.send({message: "Successfully deleted", id: todo._id})
        }
    })
})

app.listen(process.env.PORT || 8081)
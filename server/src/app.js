const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const user = require('../models/user')
const song = require('../models/song')
const bookmark = require('../models/bookmark')
const history = require('../models/history')
const jwt = require('jsonwebtoken')
const app = express()
const isAuthenticated = require('../policies/isAuthenticated')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true })
app.use(bodyParser.json())
app.use(cors())
require('./passport')
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
                { title: { '$regex': search, '$options': 'i' } },
                { artist: { '$regex': search, '$options': 'i' } },
                { genre: { '$regex': search, '$options': 'i' } }
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

app.get('/bookmarks',  isAuthenticated, async (req, res) => {
    const userId = req.user._id
    if (!req.query.songId) {
        bookmark
        .find({userId: userId})
        .populate('songId', {}, 'song')
        .exec(function (err, bookmarks) {
            if (err) {
                res.status(500).send({ error: "An error has occured when trying to fetch the bookmark." })
            } else {
                res.send(bookmarks)
            }
        })
    } else {
        bookmark
        .findOne({userId: userId, songId: req.query.songId})
        .exec(function (err, bookmark) {
            if (err) {
                res.status(500).send({ error: "An error has occured when trying to fetch the bookmark." })
            } else {
                res.send(bookmark)
            }
        })
    }
})

app.post('/bookmarks', isAuthenticated, async (req, res) => {
    const userId = req.user._id
    const songId = req.body.params.songId
    bookmark.create({userId: userId, songId: songId}, (err, bookmark) => {
        if (err) {
            res.status(500).send({ error: "An error has occured when creating the bookmark." })
        } else {
            res.send(bookmark)
        }
    })
})

app.delete('/bookmarks/:bookmarkId', isAuthenticated, async (req, res) => {
    const userId = req.user._id
    bookmark.findOneAndRemove({_id: req.params.bookmarkId, userId: userId}, (err, todo) => {
        if (err) {
            res.status(500).send({ error: "An error has occured when deleting the bookmark." })
        } else {
            res.send({ message: "Successfully deleted", id: todo._id })
        }
    })
})

app.post('/history', isAuthenticated, async (req, res) => {
    const userId = req.user._id
    const songId = req.body.songId
    history.create({userId: userId, songId: songId}, (err, curHistory) => {
        if (err) {
            history.findOneAndUpdate(req.body, {updateTime: new Date()}, (err, history) => {
                if (err) {
                    res.status(500).send({ error: "An error has occured when creating the history." })
                } else {
                    res.send(history)
                }
            })
        } else {
            res.send(curHistory)
        }
    })
})
app.get('/history', isAuthenticated, async (req, res) => {
    const userId = req.user._id
    history
    .find({userId: userId})
    .populate('songId', {}, 'song')
    .sort({createTime: -1})
    .limit(10)
    .exec(function (err, bookmarks) {
        if (err) {
            res.status(500).send({ error: "An error has occured when trying to fetch the history." })
        } else {
            res.send(bookmarks)
        }
    })
})

app.listen(process.env.PORT || 8081)
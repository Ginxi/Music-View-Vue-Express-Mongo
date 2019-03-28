const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const user = require('../models/user')
// const morgan = require('morgan')

const app = express()
// app.use(morgan('combined'))
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/userdb', {useMongoClient: true})
app.use(bodyParser.json())
app.use(cors())

app.post('/register', (req, res) => {
    // res.send({
    //     message: `Welcome! ${req.body.email}`
    // })
    user.create(req.body, (err, user) => {
        if (err) {
          res.send(err);
        } else {
          res.send(user);
        }
      })
})

app.listen(process.env.PORT || 8081)
const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const mongoose = require('mongoose'),
    Schema = mongoose.Schema
mongoose.Promise = global.Promise
const accountSchema = Schema({
    name: String,
    balance: Number
})
let Account = mongoose.model('Account', accountSchema, 'Accounts')

mongoose.connection.on('connected', function () {
    console.log('Connected to MongoDB')
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongodb disconnected');
});

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

app.post('/accounts', (req, res) => {
    mongoose.connect('mongodb://localhost:27017/edx-course-db',
        { useNewUrlParser: true }, (error) => {
            if (error) console.error(error)
            var account = new Account(req.body)
            account.save().then(function (result) {
                if (result) {
                    console.log('The account is saved: ', result)
                    res.send(result)
                }
                mongoose.disconnect()
            })
        })
})

app.get('/accounts', (req, res, next) => {
    mongoose.connect('mongodb://localhost:27017/edx-course-db',
        { useNewUrlParser: true }, (error) => {
            if (error) console.error(error)
            Account.find({}, function (err, data) {
                if (err) console.error(err)
                console.log('Results obtained succesfully', data)
                res.send(data)
            }).exec(() => { mongoose.disconnect() })
        })
})

app.put('/accounts/:id', (req, res) => {
    mongoose.connect('mongodb://localhost:27017/edx-course-db',
        { useNewUrlParser: true }, (error) => {
            if (error) console.log(error)
            Account.updateOne({ _id: req.params.id }, req.body, null, function (err, raw) {
                if (err) { console.log(err) }
                else {
                    console.log('Account updated succesfully', raw)
                    res.status(200).send('Account updated succesfully')
                }
            }).exec(() => {
                mongoose.disconnect()
            })
        })
})

app.delete('/accounts/:id', (req, res) => {
    mongoose.connect('mongodb://localhost:27017/edx-course-db',
        { useNewUrlParser: true }, (error) => {
            if (error) console.log(error)
            Account.remove({ _id: req.params.id }, function (err) {
                if (err) { console.log(err) }
                else {
                    console.log('Account deleted succesfully')
                    res.status(200).send('Account deleted succesfully')
                }
            }).exec(() => {
                mongoose.disconnect()
            })
        })
})

app.use(errorhandler())
app.listen(3020)
console.log('API running at port: 3020')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Trip = require("../models/trip")
//C
app.get('/newTrip', (req, res, next) => {
    res.render("newTrip")
})
app.post('/newTrip', (req, res, next) => {
    Trip
        .create({
            title: req.body.title,
        })
        .then(() => {
            res.redirect('/trips')
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//R
app.get('/trips', (req, res, next) => {
    Trip
        .find({})
        .then((tripData) => {
            res.render("trips", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//U
//D
module.exports = app;
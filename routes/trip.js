const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Trip = require("../models/trip")
//C
app.get('/trips/add', (req, res, next) => {
    res.render("trip/create")
})
app.post('/trips/add', (req, res, next) => {
    Trip
        .create({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            address: req.body.address,
            creator: req.session.currentUser._id
        })
        .then(() => {
            res.redirect('/trips')
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//R list
app.get('/trips', (req, res, next) => {
    Trip
        .find({
            creator: req.session.currentUser._id
        })
        .then((tripData) => {
            res.render("trip/list", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//R detail
app.get("/trips/:id", (req, res, next) => {
    Trip
        .findById(req.params.id)
        .then((tripData) => {
            res.render("trip/detail", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//U
app.get("/trips/update/:id", (req, res, next) => {
    Trip
        .findById(req.params.id)
        .then((tripData) => {
            res.render("trip/update", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
})
app.post("/trips/update/:id", (req, res, next) => {
    Trip
        .findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            image: req.body.image
        })
        .then(() => {
            res.redirect(`/trips/${req.params.id}`);
        })
        .catch((err) => {
            res.send('error', err)
        })
})
//D
app.get("/trips/delete/:id", (req, res, next) => {
    Trip
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect("/trips");
        })
        .catch((err) => {
            res.send('error', err);
        })
})
//export
module.exports = app;
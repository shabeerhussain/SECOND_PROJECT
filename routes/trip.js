const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Trip = require("../models/trip")
const fetch = require('node-fetch');


//C
app.get('/trips/add', (req, res, next) => {
    res.render("trip/create")
})
app.post('/trips/add', (req, res, next) => {
    const address = req.body.address
    const apiKey = "AIzaSyAqx4mZpdi7OxChA3mHmwoJ38pIFc1Xux8" 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
    const latlng = fetch(url).then(resp=>resp.json()).then(resp=>{
        const {lat,lng} =  resp.results[0].geometry.location
        Trip
        .create({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            address: req.body.address,
            creator: req.session.user._id,
            coordinates:[lat,lng]   // storing lat/lng
        })
        .then(() => {
            res.redirect('/trips')
        })
        .catch((err) => {
            res.json(err); return;
        })
        
    }).catch(err=>{ // fetching lat/long of address
    throw err;
})

    
})
//R list
app.get('/trips', (req, res, next) => {
    if(req.session.isloggedin){  // sh chanaged checking if user is logged in otherwise to login page
        Trip
        .find({
            creator: req.session.user._id
        })
        .then((tripData) => {
            res.render("trip/list", {
                tripsHbs: tripData
            });
        })
        .catch((err) => {
            res.send('error', err)
        })
    }
    
})
//R calendar
app.get('/calendar', (req, res, next) => {
    Trip
        .find({
            creator: req.session.user._id
        })
        .lean()
        .then((tripData) => {
            debugger            
            res.render("calendar", {
                tripsHbs: JSON.stringify(tripData)
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
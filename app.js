require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
app.use(express.static('public'))
//====bcrypt=================
const bcrypt = require("bcrypt");
const saltRounds = 10;
//====bcrypt=================
app.use(express.json()); //Used to parse JSON bodies
app.use(bodyParser.urlencoded({ // data from the form is sent to router (works with auth.js in routes)
    extended: true
}));
//===========middleware gateway for all routes and gate keeper based on logins========
app.use(session({
    secret: "basic-auth-secret",
    cookie: {
        maxAge: 60000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // 1 day
    })
}));

app.use(function(req,res,next){
    res.locals.isloggedin = false;
    if(req.session.isloggedin){
        res.locals.user = req.session.user;
        res.locals.isloggedin = true;
    }
    next();
})

hbs.registerPartials(__dirname + '/views/partials'); //all files in views/partials will be treated as partials 
// view engine setup
app.set('views', path.join(__dirname, 'views')) //server the views in the views folder
app.use(express.static(path.join(__dirname, 'public'))); //get static files from public folder
app.set('view engine', 'hbs')

//login session save user stuff
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
//DB connection
mongoose.connect(process.env.prod_db, {
        useNewUrlParser: true
    })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });
//import
const router = require('./routes/auth'); // setting up all the routes a root
app.use('/', router);
app.use('/', require('./routes/index'));
app.use('/', require('./routes/trip'));
// const calendar = require('./routes/calendar');
// app.use('/', calendar);
//listener
const http = require('http');
const server = http.createServer(app);
server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${process.env.PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${process.env.PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});
//export
module.exports = app;
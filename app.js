require('dotenv').config()
const express = require('express')
const hbs = require('hbs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs')
//DB connection
mongoose.connect(process.env.db, {
        useNewUrlParser: true
    })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });
//import index.js
const index = require('./routes/index');
app.use('/', index);
const tripRoutes = require('./routes/tripRoutes');
app.use('/', tripRoutes);

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
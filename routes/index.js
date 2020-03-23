const express = require('express')
const app = express()

//home
app.get('/', (req, res, next) => {
    res.render('index');
});

//export
module.exports = app;
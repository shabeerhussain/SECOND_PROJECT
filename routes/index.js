const express = require('express')
const app = express()

//home
app.get('/', (req, res, next) => {
    //res.locals.user = req.session.currentUser;
    res.render('index');
});

//export
module.exports = app;
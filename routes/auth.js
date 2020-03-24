const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res, next) => { // url - route to server the sign up page
  res.render("auth/signup");
});

router.get("/", (req, res, next) => { // url - route to serve the login page
  res.render("landing")
});

router.get("/login", (req, res, next) => { // url - route to serve the login page
  res.render("auth/login");
});

router.get("/logout", (req, res, next) => { // destroys the current user session
  req.session.destroy(function (err) {
    res.redirect('/');
    // cannot access session here
  })
});

router.get("/main", (req, res, next) => { // checks if user is logged in. then main page otherwise redirect to the login page
  //res.json(req.session);
  if (req.session.isloggedin) {
    res.render('main')
    return;
  }
  res.redirect('/'); // redirect to login page
});

router.get("/private", (req, res, next) => { // checks if user is logged in. then private page otherwise redirect to the login page
  //res.json(req.session);  
  if (req.session.isloggedin) {
    res.render('private')
    return;
  }
  res.redirect('/');
});

router.get("/about", (req, res, next) => { // url - route to serve the about page
  res.render("about");
});

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.post("/signup", (req, res, next) => { // when clicked signup
  const username = req.body.username;
  const password = req.body.password; // these are the signup form values
  const salt = bcrypt.genSaltSync(bcryptSalt); // generating the salt
  const hashPass = bcrypt.hashSync(password, salt); // creating an hash of the password using salt

  if (username === "" || password === "") { // if username and password is empty then serve them the signup page with error
    res.render("auth/signup", {
      errorMessage: "No user name or password given"
    });
    return;
  }

  User.findOne({
      "username": username
    }) //look through DB look for username from the form
    .then(user => { // if username is already in database then server signup page with error
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      User.create({ // create new user in DB
          username,
          password: hashPass, // use hasPass & salt
          hash: salt
        })
        .then(() => { //if user is created sucessully then redirect to login page
          res.redirect("/");
        })
        .catch(error => { // error so error 
          res.json(error)
        })
    })
    .catch(error => {
      next(error); // it will not stop the exection of the appliction 
    })
});

router.post("/login", (req, res, next) => { // this login 
  // req.session.isloggedin=0
  const username = req.body.username; //these are the login form values
  const password = req.body.password;

  if (username === "" || password === "") { //username and password checks
    res.render("auth/login", {
      errorMessage: "No user name or password given"
    });
    return;
  }

  User.findOne({
      "username": username
    }) // checking if usename is in the DB
    .then(user => {
      if (user === null) { //if not in DB send user back to login and throw error
        res.render("auth/login", {
          errorMessage: "The username does not exists!"
        });
        return;
      }
      // res.json({hash:bcrypt.hashSync(user.password, user.hash), user})
      bcrypt.compare(req.body.password, user.password, (err, result) => { //bcrypt password check between user entered password and the password in the DB
        if (result == true) {
          req.session.isloggedin = true // setting up the session and redirecting the use to the main page
          req.session.currentUser = user;
          req.session.save(function (err) {

            res.redirect('main')
          })


        } else {
          res.render("auth/login", { // incase wrong info input
            errorMessage: "Wrong Password!"
          });
          return;
        }
      })

    })
    .catch(error => {
      next(error);
    })
});

module.exports = router;
const path = require("path");
require("dotenv").config();
// console.log(process.env);
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { log } = require("console");
const encrypt = require("mongoose-encryption");


const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");



const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use functionality of session

app.use(session({
    secret: "thisisoursecret",
    resave: false,
    saveUninitialized: true,

}));

// Initialize passport
app.use(passport.initialize());

// Start the session
app.use(passport.session({

    secret:"thisisoursecret",
    resave:false,
    saveUninitialized:true,

}));

// Initialize passport
app.use(passport.initialize());

// Start the session
app.use(passport.session());


mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

// Place this after the model 'User'
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",

    // Endpoint to know about the user information (user-info) 
    // Since google+ api has been deprecated .. it will throw an error if this userProfileURL is not specified explicitly
    userProfileURL:"https://www.googleapis.com/0auth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


// Get request for home route
app.get("/", (req, res) => {
    res.render("home");
});

// Get request for /home
app.get("/home", (req, res) => {
    res.render("home");
});


// Get request for /register
app.get("/register", (req, res) => {
    res.render("register", { isRegistered: true });
});


// Get request for /login
app.get("/login", (req, res) => {
    res.render("login", { isRegistered: "no", checkPassword: true });
});

// Get request for /logout
app.get("/logout", (req, res) => {

    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});


// Authenticate /secrets

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.render("login", { isRegistered: "no", checkPassword: false });
    }
});

// Post request for /register
app.post("/register", (req, res) => {

    const inputEmail = req.body.username;
    const inputPassword = req.body.password;

    // This register() comes from passport-local-mongoose 
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {

            // The authentication that we are trying to give is "local"
            passport.authenticate("local")(req, res, function () {
                console.log("User saved successfully");
                res.redirect("/secrets");
            });
        }

    });



});



// Post request for /login

app.post("/login", (req, res) => {


    
    User.findOne({email:enteredEmail}).then(foundUser=>{

        if(foundUser){

            bcrypt.compare(enteredPassword,foundUser.password).then(result=>{
                if(result === true){
                    res.render("secrets");
                } else {
                    res.render("login",{isRegistered:"no",checkPassword:false});
                }
            }).catch(err=>{
                console.log(err);
            });
        } else {
            res.render("register",{isRegistered:false});
        }
    }).catch(err=>{
        console.log(err);
        
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log("Session has started successfully..");
                res.redirect("/secrets");
            });
        }
    });

});







// });


// Port listening
app.listen(PORT, () => { console.log(`Your server started running on port ${ PORT }`) });


// Hash function is a mathematical function that makes almost impossible to go back or decrypt back to original text


// General Defination in DS: The hash function is used to map or bind the data to a particular hash value and then that hash value will be used as an index or a key to store that value in the hash table.
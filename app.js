const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const { log } = require("console");

const app = express();

const PORT = process.env.PORT || 3000;

const isRegisterded = false;


app.use(bodyParser.urlencoded({
    extended: true
}));


// App setup and other configurations..

app.use(express.static("public"));
app.set("view engine", "ejs");

// Mongoose connection

mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });


// Defining Mongoose Schema 

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


// Creating a user model from userSchema

const User = mongoose.model("User", userSchema);



// GET REQUEST
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/", (req, res) => {
    res.render("home");
});



app.get("/register", (req, res) => {
    res.render("register", { NewRegister: false });
});



app.get("/login", (req, res) => {
    res.render("login", { Registered: false });
});



app.get("/logout", (req, res) => {
    res.redirect("/");
});


app.get("/secrets", (req, res) => {
    res.render("/secrets");
});



app.post("/register", (req, res) => {

    const email = req.body.username;
    const password = req.body.password;


    User.findOne({ username: email }).then(foundUser => {
        if (foundUser) {
            if (foundUser.username === email) {
                res.render("login", { Registered: true })
            }
        } else {

            const user = new User({
                username: email,
                password: password
            });


            user.save().then(() => {
                console.log("Your user is updated successfully in the database");
            }).catch(err => {
                console.log("ERROR");
            });

            res.render("secrets");

        }
    }).catch(err => {
        console.log(err);
    });
});


app.post("/login", (req, res) => {

    const email = req.body.username;
    const password = req.body.password;

    User.findOne({ username: email }).then(foundUser => {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                res.render("login", { Registered: "invalid" });
            }
        } else {
            res.render("register", { NewRegister: true });
        }
    }).catch(err => {
        console.log("ERROR!");
    });
});





app.listen(PORT, () => { console.log("Your server started running on port 3000") });
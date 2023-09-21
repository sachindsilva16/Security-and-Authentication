const path = require("path");
require("dotenv").config();
// console.log(process.env);
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { log } = require("console");
const encrypt = require("mongoose-encryption");


const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

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
    res.render("register",{isRegistered:true});
});


// Get request for /login
app.get("/login", (req, res) => {
    res.render("login",{isRegistered:"no",checkPassword:true});
});

// Get request for /logout
app.get("/logout",(req,res)=>{
    res.redirect("/");
});

// Post request for /register
app.post("/register", (req, res) => {

    const inputEmail = req.body.username;
    const inputPassword = req.body.password;

    
    
});



// Post request for /login

app.post("/login", (req, res) => {

    const enteredEmail = req.body.username;
    const enteredPassword = req.body.password;

    
   
});


// Port listening
app.listen(PORT, () => { console.log(`Your server started running on port ${ PORT }`) });


// Hash function is a mathematical function that makes almost impossible to go back or decrypt back to original text


//General Defination in DS: The hash function is used to map or bind the data to a particular hash value and then that hash value will be used as an index or a key to store that value in the hash table.


// console.log(md5("123"));
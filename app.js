const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { log } = require("console");

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


const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});


app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/logout",(req,res)=>{
    res.redirect("/");
});


app.post("/register", (req, res) => {

    const inputEmail = req.body.username;
    const inputPassword = req.body.password;

    

    User.findOne({email:inputEmail}).then(foundUser=>{
        if(foundUser){
            if(foundUser.email === inputEmail){
                console.log("User email already exists.. Please Login..");
                res.redirect("/login");
            }
            
        } else {
            const newUser = new User({
                email: inputEmail,
                password: inputPassword
            });

            newUser.save().then(() => {
                console.log("User is added successfully to the database");
                res.render("secrets");
            }).catch(err => {
                console.log(err);
            });
        }
    })
});



// Post request for /login

app.post("/login", (req, res) => {

    const enteredEmail = req.body.username;
    const enteredPassword = req.body.password;

    User.findOne({ email: enteredEmail }).then(foundUser => {
        if (foundUser) {
            if (foundUser.password === enteredPassword) {
                console.log("Successful login..");
                res.render("secrets");
            }
        } else {
            res.redirect("/register");
        }
    }).catch(err => {
        console.log(err);
    });
});



app.listen(PORT, () => { console.log(`Your server started running on port ${ PORT }`) });
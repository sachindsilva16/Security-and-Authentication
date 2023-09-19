const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });

app.get("/",(req,res)=>{
    res.render("home");
});


app.get("/register",(req,res)=>{
    res.render("register");
});


app.get("/login",(req,res)=>{
    res.render("login");
});



app.listen(PORT,()=>{console.log(`Your server started running on port ${PORT}`)});
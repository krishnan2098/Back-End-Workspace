var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", (req,res) => {
   res.render("secret") ;
});

app.listen(process.env.PORT,process.env.IP, () => {
    console.log("server has started ...");
})
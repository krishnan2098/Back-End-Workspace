var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret:"Rusty is the cutest dog in the world",
    resave: "false",
    saveUninitialized:"false"
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============
// ROUTES
//===============

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", (req,res) => {
   res.render("secret") ;
});

//Auth routes
//Show sign up form
app.get("/register", (req, res) => {
    res.render("register");
});

//handling user sign up
app.post("/register", (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
//Render Login forms
app.get("/login", (req, res) => {
    res.render)("login");
});

app.listen(process.env.PORT,process.env.IP, () => {
    console.log("server has started ...");
});
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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===============
// ROUTES
//===============

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req,res) => {
   res.render("secret") ;
});

//Auth routes
//Show sign up form
app.get("/register", (req, res) => {
    res.render("register");
});

//handling user sign up
app.post("/register", (req, res) => {
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
    res.render("login");
});

//login logic
//using middleware
app.post("/login",passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(process.env.PORT,process.env.IP, () => {
    console.log("server has started ...");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User =require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// Passport CONFIG
app.use(require("express-session")({
    secret: "Rusty is the cutest!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware enabling us to access user data on all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


app.get("/", ( req, res) => {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds});      
        }
    });
});

//CREATE -  Add new campground to DB
app.post("/campgrounds", ( req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            // redirect to campgrounds page    
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - show more info about campground
app.get("/campgrounds/:id", (req, res) => {
    //Find campground with provided id
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ==========================
// COMMENTS ROUTES
// ==========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res) => {
    // Find campground from DB
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", (req, res) => {
    
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           //create new comment
           Comment.create(req.body.comment, (err, comment) => {
               if(err) {
                   console.log(err);
               } else {
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

//====================
// Auth routes
//====================
//show register form
app.get("/register", (req, res) => {
    res.render("register");
});

//handle signup logic
app.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    });
});

//show login form
app.get("/login", (req, res) => {
    res.render("login");
});

//handling login logic
app.post("/login", passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
});

//logut route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

//middleware checking if user is still logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen( process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Activated");
});

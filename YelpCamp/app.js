var express = require("express");
var app = express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
//     description: "This is a huge granite hill, no bathrooms. Only fresh air and camps."
// },
// function(err, campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(campground);
//     }
// });


app.get("/", function( req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds});      
        }
    });
});

//CREATE -  Add new campground to DB
app.post("/campgrounds", function( req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect to campgrounds page    
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//SHOW - show more info about campground
app.get("/campgrounds/:id", function(req, res){
    //Find campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //Render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen( process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Activated");
});
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ==========================
// COMMENTS ROUTES
// ==========================

router.get("/new", isLoggedIn, (req,res) => {
    // Find campground from DB
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

router.post("/", (req, res) => {
    
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

//middleware checking if user is still logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
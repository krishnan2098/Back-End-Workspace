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
                   //add username and id to comment
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id
                   //save comment
                   comment.save();
                   console.log(comment);
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

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
       if(err) {
            res.redirect("/campgrounds/" + req.params.id);
       } else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
       }
    });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedCampground) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

//middleware to handle user authorisation
function checkCommentOwnership(req, res, next){
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                console.log(err);
            } else {
                //does user own the campground?
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                //otherwise redirect
                } else {
                    res.redirect("back");
                }
            }
        });
    //if not redirect
    } else {
        res.redirect("back");
    }
}

//middleware checking if user is still logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
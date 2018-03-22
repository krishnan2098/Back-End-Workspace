var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lilly"];

app.get("/", function(req, res){
    res.render("home");
});

app.get("/friends", function(req, res){
    res.render("friends", {friends:friends});
});

app.post("/addfriends", function(req, res){
    var newFriend = req.body.newfriend;
    friends.push(newFriend);
    res.redirect("friends");
    console.log("POST REQUEST RECIEVED!!");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});
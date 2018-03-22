var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!!");
});

app.get("/", function(req, res){
    res.render("home");
});

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing;
    res.render("love", {thingVar: thing});
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "Post 1", author: "Person 1"},
        {title: "Post 2", author: "Person 2"},
        {title: "Post 3", author: "Person 3"}
        ];
    res.render('posts', {posts: posts});
});
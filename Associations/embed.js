var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

//Post
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

var Post = mongoose.model("Post", postSchema);

// User
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema]
});

var User = mongoose.model("User", userSchema);

// DUMMY USER
var newUser = new User({
    email: "hermoine@hogwarts.edu",
    name: "Hermoine Granger"
});

newUser.posts.push({
    title: "How to brew polyjuice potion",
    content: "Just kiiding. Go to potion's class and learn it"
});

newUser.save(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});

// var newPost = new Post({
//     title: "Reflection on apples",
//     content: "They are very delicious"
// });

// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });
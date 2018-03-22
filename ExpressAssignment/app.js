var express = require("express");
var app = express();

// Homepage message.
app.get("/", function(req, res){
   res.send("Hi there, welcome to my assignment!"); 
});

// routing for path variable animal
app.get("/speak/:animalName", function(req, res){
  var sounds = {
      cow: 'Moo',
      pig: 'Oink',
      dog: 'Woof Woof!',
      cat: 'Meow',
      goldfish: '...'
  }
  var animal = req.params.animalName.toLowerCase();// toLowerCase is used for considering even uppercase statuses as the change of spelling doesnt affect the animal sound
  var sound = sounds[animal];
  res.send("The animal " + animal + " says '" + sound); 
});

// routing for path variable string which will repeated n times
app.get("/repeat/:string/:iterator", function(req, res){
  var message = req.params.string;
  var times = Number(req.params.iterator);
  var repeatedString = "";
  for(var i = 0; i < times; i++){
    repeatedString += message + " ";
  };
  res.send(repeatedString);
});

// routing for any other requests
app.get("*",function(req, res){
  res.send("Sorry, page not found...What are you doing with your life?");
});

//Listening to requests.
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER HAS STARTED LISTENING TO ANY REQUESTS IN THIS DOMAIN!");
});

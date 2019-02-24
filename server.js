var express = require("express");
var mongoose = require("mongoose");
var routes = require("./routes");


var PORT = 3000;

// Initialize Express
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


app.use("/",routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true })
  .then((data) =>{
    // Start the server
    app.listen(PORT, function () {
      console.log("Scraper running on port " + PORT + "!");
    });
})
.catch(err =>{
  console.log('Error connecting MongoDB');
});


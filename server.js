require ("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");


const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


app.use("/",routes);


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then((data) =>{
    // Start the server
    app.listen(PORT, function () {
      console.log("Scraper running on port " + PORT + "!");
    });
})
.catch(err =>{
  console.log('Error connecting MongoDB');
});


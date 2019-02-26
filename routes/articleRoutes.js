const router = require("express").Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./../models");
const path = require("path");

router.use("/scrape", function(req, res){
  axios.get("http://www.echojs.com")
    .then(response =>{
      var $ = cheerio.load(response.data);
      //console.log($('article').length);
      const articleArr = [];
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
          // Save an empty result object
          var result = {};

          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
            .children("a")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");

          articleArr.push(result);
          
        });

        console.log("Scraped and found Articles : " + articleArr.length);

        db.Article.create(articleArr)
        .then((dbArticle) => {
          console.log("Articles Saved");
          res.sendFile(path.join(__dirname + './../public/index.html'));
        })
        .catch(err => {
          console.log(err);
          res.json(err);
        });
    })
    .catch(err => res.send(err))
})

// Returns all the articles
router.use("/all", function(req, res){
  db.Article.find()
    .then((dbArticle) => {
      console.log('Found Articles : ' + dbArticle.length);
      res.json(dbArticle);
    })
    .catch(err => {
      console.log("Error retrieving Articles." + err)
      res.json(err);
    });
});


// Returns all the comments for an article
router.use("/getArticle/:id", function(req, res){
  console.log('req.params.id : ' + req.params.id);
  db.Article.find({ _id: req.params.id })
    .populate('comments')
    .then(function(dbArticle) {
      console.log('Found Articles by ID: ' + req.params.id + " - "+ dbArticle.length);
      res.json(dbArticle);
    })
    .catch(err => {
      console.log("Error retrieving Articles." + err)
      res.json(err);
    });
});


//Deletes all the articles
router.use("/clear", function(req, res){
  db.Article.deleteMany()
    .then((dbArticle) => {
      console.log('Deleted Articles');
      res.sendFile(path.join(__dirname + './../public/index.html'));
    
    })
    .catch(err => {
      console.log("Error deleting all Articles." + err)
      res.json(err);
    });
});


//Saves the comment
router.route("/comment/:id?")
.post(function(req, res){
  
  let commentData = {comment: req.body.userComment, by : req.body.by};
  db.Comment.create(commentData)
    .then(function (dbComment) {
      return db.Article.findByIdAndUpdate({ _id: req.body.article_id }, {$push:{comments: dbComment._id}}, { new: true })
      .then((dbArticle) => {
        console.log('Saved Comment');
        res.sendFile(path.join(__dirname + './../public/index.html'));
      
      })
      .catch(err => {
        console.log("Error Saving Comment." + err)
        res.json(err);
      });
    });
})
.delete(function(req,res){
  let id = req.params.id;
  console.log('To Delete comment : ' + id);
  db.Comment.deleteOne({_id:id})
    .then(function (dbComment){
    return db.Article.findByIdAndUpdate({ _id: req.body.article_id }, {$pull:{comments: dbComment._id}})
      .then((dbArticle) => {
        console.log('Deleted Comment');
        //res.sendFile(path.join(__dirname + './../public/index.html'));
        res.json(dbArticle);
      })
      .catch(err => {
        console.log("Error Deleting Comment." + err)
        res.json(err);
      });
    })
});

module.exports = router;
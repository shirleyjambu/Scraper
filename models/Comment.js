const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment : {
    type : String,
    required : true
  },
  by : {
    type : String,
    required : false,
    default : 'Guest'
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
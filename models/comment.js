var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  text: String,
  date: { type: Date, default: Date.now },
  post: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  },
});
module.exports = mongoose.model("Comment", commentSchema);

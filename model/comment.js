'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  incidentID: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentID: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true, minlength: 1 },
  timeStamp: { type: Date, required: true }
});

module.exports = mongoose.model('comment', commentSchema);

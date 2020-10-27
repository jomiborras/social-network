'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User'},
	publication: { type: Schema.ObjectId, ref: 'Publication'},
	text: String,
	created_at: String
});

module.exports = mongoose.model('Comment', CommentSchema);
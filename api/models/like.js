'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User' },
	publication: { type: Schema.ObjectId, ref: 'Publication' },
	created_at: String
});

module.exports = mongoose.model('Like', LikeSchema);
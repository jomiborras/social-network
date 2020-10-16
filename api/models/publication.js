'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = ({
	user: { type: Schema.ObjectId, ref: 'User' },
	title: String,
	text: String,
	file: String,
	created_at: String,
});

module.exports = mongoose.model('Publication', PublicationSchema);
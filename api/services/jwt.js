'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'acemACEMacemACEMacem';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		last_name: user.last_name,
		nick_name: user.nick_name,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secret);
};
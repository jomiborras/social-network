'use strict'

// var path = require('path');
// var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Use = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
	res.status(200).send({message: 'Hola desde el follow controller'});
}

// Seguir
function saveFollow(req, res){

	var params = req.body;

	var follow = new Follow();
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((err, followStored) => {
		if(err) return res.status(500).send({message: 'Error al seguir usuario'});

		if(!followStored) return res.status(404).send({message: 'No se ha podido seguir el usuario'});

		return res.status(200).send({follow: followStored});
	});
}

// Dejar de seguir
function unFollow(req, res){
	var userId = req.user.sub;
	var followId = req.params.id;

	Follow.find({'user': userId, 'followed': followId}).deleteOne(err => {
		if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

		return res.status(200).send({message: 'Se ha dejado de seguir'});
	});
}

// Listado paginado de los usuarios seguidos
function getFollowingUsers(req, res){
	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}

	var itemsPerPage = 4;

	Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) =>{
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'No estás siguiendo a ningún usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});
}

function getFollowedUsers(req, res){
	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}

	var itemsPerPage = 4;

	Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) =>{
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'Aún no te sigue ningún usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
		});
	});
}

// Devolver usuarios que sigo y me siguen
function getMyFollows(req, res){
	var userId = req.user.sub;

	var find = Follow.find({user: userId});

	if(req.params.followed){

		// if(req.paramas.followed == 0) return res.status(200).send({message: 'Todavía no te sigue ningún usuario'});
		var find = Follow.find({followed: userId});
	}

	find.populate('user followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'No sigues a ningún usuario'});

		return res.status(200).send({follows});
	});
}



module.exports = {
	prueba,
	saveFollow,
	unFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
}
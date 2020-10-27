'use strict'

var path = require('path');
var fs = require('fs');
var paginate = require('mongoose-pagination');
var moment = require('moment');

var Use = require('../models/user');
var Publication = require('../models/publication');
var Like = require('../models/like');

// Método de prueba
function pruebaLike(req, res){
	res.status(200).send({message: 'Hola desde el controlador like'});
}

// Darle like a una publicación
function saveLike(req, res){

	var params = req.body;

	var like = new Like();
	like.user = req.user.sub;
	like.publication = params.publication;
	like.created_at = moment().unix();

	like.save((err, likeStored) => {
		if(err) return res.status(500).send({message: 'Error al darle like a la publicación'});

		if(!likeStored) return res.status(404).send({message: 'No se ha guardado tu like'});

		return res.status(200).send({like: likeStored});
	});
}

// Dejar de gustar una publicación
function unLike(req, res){
	var userId = req.user.sub;
	var publicationId = req.params.id;

	Like.find({'user': userId, 'publication': publicationId}).deleteOne(err => {
		if(err) return res.status(500).send({message: 'Error al dejar de gustar'});

		return res.status(200).send({message: 'Te ha dejado de gustar la publicación'});
	});
}

// Devolver la cantidad de likes de una publicación
function getLikes(req, res){
	var publicationId = req.params.id;

	getCountPublication(publicationId).then((value) => {

		return res.status(200).send(value);

	});
}

async function getCountPublication(publication_id){

	var likes = await Like.count({'publication': publication_id}).exec().then((count) => {
		return count;
	}).catch((err) => {
		return handleError(err);
	});

	return {
		likes: likes
	}
}



module.exports = {
	pruebaLike,
	saveLike,
	unLike,
	getLikes
}
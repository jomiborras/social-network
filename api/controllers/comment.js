'use strict'

var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

var User = require('../models/user');
var Publication = require('../models/publication');
var Comment = require('../models/comment');

// Método de prueba
function pruebaComment(req, res){
	res.status(200).send({message: 'Hola mundo desde el controlador de mensajes'});
}

// Comentar una publicación
// Se debe pasar un text por los parámetros de body como comentario, y el id de la publicación en la url
function saveComment(req, res){
	var params = req.body;
	var publicationId = req.params.publication;

	if(!params.text) return res.status(200).send({message: 'Debes escribir un comentario'});

	var comment = new Comment();
	comment.user = req.user.sub;
	comment.publication = publicationId;
	comment.text = params.text;
	comment.created_at = moment().unix();

	comment.save((err, commentStored) => {
		if(err) return res.status(500).send({message: 'Error al comentar'});

		if(!commentStored) return res.status(404).send({message: 'No se ha podido comentar'});

		return res.status(200).send({comment: commentStored});

	});

}

// Devolver un comentario
function getComment(req, res){
	var commentId = req.params.id;

	Comment.findById(commentId, (err, comment) => {
		if(err) return res.status(500).send({message: 'Error al devolver la publicación'});

		if(!comment) return res.status(404).send({message: 'El comentario no existe o ha sido borrado'});

		return res.status(200).send({comment});
	});
}

// Devolver los comentarios paginados de una publicación
function getComments(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Comment.find({publication: req.params.publication}).populate('user', '_id name last_name image').paginate(page, itemsPerPage, (err, comments, total) => {
		if(err) return res.status(500).send({message: 'Error al devolver los comentarios'});

		if(!comments) return res.status(404).send({message: 'Aún no hay comentarios'});

		var comments_clean = [];

		comments.forEach((comment) => {
			comment.user.password = undefined;
			comments_clean.push(comment);
		});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			comments: comments_clean
		});

	});

}

// Editar un comentario
function editComment(req, res){
	var commentId = req.params.id;
	var update = req.body;

	Comment.findOneAndUpdate({'user': req.user.sub, '_id': commentId}, update, {new: true, useFindAndModify: false}, (err, commentUpdated) => {
		if(err) return res.status(500).send({message: 'Error al editar el comentario'});

		if(!commentUpdated) return res.status(404).send({message: 'No se pudo editar el comentario'});

		return res.status(200).send({
			comment: commentUpdated
		});
	});
}

// Eliminar un comentario
function deleteComment(req, res){
	var commentId = req.params.id;

	Comment.find({'user': req.user.sub, '_id': commentId}).remove(err => {
		if(err) return res.satus(500).send({message: 'Error al borrar el comentario'});

		return res.status(200).send({message: 'Se ha eliminado el comentario'});

	});
}

module.exports = {
	pruebaComment,
	saveComment,
	getComment,
	getComments,
	editComment,
	deleteComment
}
'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
var Comment = require('../models/comment');

// Método de prueba
function pruebaPublication(req, res){
	res.status(200).send({message: 'Hola mundo desde el controlador de publicaciones'});
}

// Crear una publicación
function savePublication(req, res){
	var params = req.body;

	if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'});

	var publication = new Publication();
	publication.text = params.text;
	publication.file = 'null';
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((err, publicationStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar la publicación'});

		if(!publicationStored) return res.status(404).send({message: 'No se ha podido guardar la publicación'});

		return res.status(200).send({publication: publicationStored});
	});

}

// Listar todas las publicaciones paginadas de los usuarios seguidos
function getPublications(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

		var follows_clean = [];

		follows.forEach((follow) => {
			follows_clean.push(follow.followed);
		});

		Publication.find({user: {'$in': follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
			if(err) return res.status(500).send({message: 'Error al devolver publicaciones'});

			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

			return res.status(200).send({
				total_items: total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				publications 
			});
		});

	});

}

// Devolver una publicación
function getPublication(req, res){
	var publicationId = req.params.id;

	Publication.findById(publicationId, (err, publication) => {
		if(err) return res.status(500).send({message: 'Error al devolver la publicación'});

		if(!publication) return res.status(404).send({message: 'La publicación no existe'});

		return res.status(200).send({publication});
	});
}

// Editar una publicación
function editPublication(req, res){
	var publicationId = req.params.id;
	var update = req.body;

	Publication.findOneAndUpdate({'user': req.user.sub, '_id': publicationId}, update, {new: true, useFindAndModify: false}, (err, publicationUpdated) => {
		if(err) return res.status(500).send({message: 'Error al editar la publicación'});

		if(!publicationUpdated) return res.status(404).send({message: 'No se pudo editar la publicación'});

		return res.status(200).send({
			publication: publicationUpdated
		});
	});
}


// Eliminar una publicación
function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove((err, publicationRemoved) => {
		if(err) return res.status(500).send({message: 'Error al borrar la publicación'});

		if(!publicationRemoved) return res.status(404).send({message: 'Error al borrar la publicación'});

		if(publicationRemoved) {
			Comment.find({'publication': publicationId}).remove(err => {
				if(err) return res.status(500).send({message: 'Error al borrar los comentarios'});

				// return res.status(200).send({message: 'Se han eliminado los comentarios'});
			});

			// if(!publicationRemoved) return res.status(404).send({message: 'No se ha podido borrar la publicación'});

			return res.status(200).send({message: 'Se ha eliminado la publicación'});
		}
		
	});

	
}

// Subir imágenes a la publicación
function uploadImage(req, res){
	var publicationId = req.params.id;

	if(req.files){
		var file_path = req.files.image.path;

		var file_split = file_path.split('\\');

		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		
		var file_ext = ext_split[1];
		

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

			Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication)=> {
				if(publication){
					// Actualizar documento de la publicación
					Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) =>{
						if(err) return res.status(500).send({message: 'Error en la petición'});

						if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar la imagen'});

						return res.status(200).send({publication: publicationUpdated});
					});
				}else{
					return removeFilesOfMedia(res, file_path, 'No tienes permiso actualizar esta publicación');
				}

			});
				
		}else{
			return removeFilesOfMedia(res, file_path, 'La extensión del archivo no es válida');
		}

	}else{
		return res.status(200).send({message: 'No se ha podido subir la imagen'});
	}

}

function removeFilesOfMedia(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function getImageFile (req, res){
	var image_file = req.params.imageFile;
	var path_file = './media/publications/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	pruebaPublication,
	savePublication,
	getPublications,
	getPublication,
	editPublication,
	deletePublication,
	uploadImage,
	getImageFile
}
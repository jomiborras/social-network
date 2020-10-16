'use strict'

var bcrypt = require('bcrypt-nodejs');

var mongoosePaginate = require('mongoose-pagination');
// Librería FILE SYSTEM de NODEJS
var fs = require('fs');
// Sistema de ficheros
var path = require('path');

var User = require('../models/user');

var jwt =require('../services/jwt');

// Métodos de prueba
function home(req, res){
	res.status(200).send({
		message: 'Hello World!'
	});
}

function pruebas(req, res) {
	console.log(req.body);
	res.status(200).send({
		message: 'Pruebas en servidor nodejs'
	});
}

// LogOn
function saveUser(req, res) {
	// recoger todo lo que llegue por POST
	var params = req.body;
	// crear instancia de un nuevo objeto de usuario
	var user = new User();

	if(params.name && params.last_name && params.nick_name && params.email && params.email && params.password){

		user.name = params.name;
		user.last_name = params.last_name;
		user.nick_name = params.nick_name;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		// Control de email y usuarios duplicados
		User.find({ $or: [
			{email: user.email.toLowerCase()},
			{nick_name: user.nick_name.toLowerCase()}
			]}).exec((err, users) => {
				if(err) return res.status(500).send({message: 'Erros en la petición de Usuarios'});

				if(users && users.length >= 1){
					return res.status(200).send({message: 'El usuario que intenta registrar, ya existe'});
				}else {
					// llamo a bcrypt y su método hash
					bcrypt.hash(params.password, null, null, (err, hash) => {
						user.password = hash;

						user.save((err, userStored) => {
							if(err) return res.status(500).send({message: 'Error al registrar el usuario'});

							if(userStored){
								res.status(200).send({user: userStored});

								}else{
									res.status(404).send({message: 'No se ha registrado el usuario'});

									}
								});
						});
					}
			});

		}else {
		res.status(200).send({
			message: 'Faltan datos por completar'
		});
	}
}

// function loginUser(req, res){
// 	var params = req.body;

// 	var email = params.email;
// 	var nick_name = params.nick_name;
// 	var password = params.password;

// 	User.find({ $or: [
// 		{email: email},
// 		{nick_name: nick_name}
// 		]}).exec((err, user) => {
// 			if(err) return res.status(500).send({message: "Error en la petición"});

// 			if(user){
// 				bcrypt.compare(password, user.password, (err, check) => {
// 					if(check){
// 						// devolver datos del usuario
// 						return res.status(200).send({user});
// 					}else{
// 						return res.status(404).send({message: "Email, usuario o contraseña incorrectos"});
// 					}
// 				});
// 			}else {
// 				return res.status(404).send({message: "Email, usuario o contraseña incorrectos"});
// 			}
// 		});
// }

// function loginUser(req, res){
// 	var params = req.body;

// 	var email = params.email;
// 	var nick_name = params.nick_name;
// 	var password = params.password;

// 	User.findOne({ $or: [{nick_name: nick_name}, {email: email}]}, (err, user) => {
// 		if(err) return res.status(500).send({message: "Error en la petición"});

// 		if(user){
// 			bcrypt.compare(password, user.password, (err, check) => {
// 				if(check){
// 					//devolver datos de usuario
// 					return res.status(200).send({user});
// 				}else{
// 					return res.status(404).send({message: 'Email, usuario o contraseña incorrectos'});
// 				}
// 			});
// 		}else{
// 			return res.status(404).send({message: 'Email, usuario o contraseñá incorrectos'});
// 		}
// 	});
// }

// LogIn
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email}, (err, user) =>{
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					
					if(params.gettoken){
						// devolver token
						// generar token
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						// devolver datos de usuario
						// para no devolver el password
						user.password = undefined;					
						return res.status(200).send({user});
					}
					
				}else{
					return res.status(40).send({message: 'Email o contraseña incorrectos'});
				}
			});
		}else {
			return res.status(404).send({message: 'Email o contraseña incorrectos'});
		}
	});
}

// getUser conseguir datos de un usuario
function getUser(req, res){
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'El usuario no existe'});

		return res.status(200).send({user});
	});
}

// Devolver un listado de usuarios paginado con mongoos-pagination
function getUsers(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		return res.status(200).send({
			users,
			total,
			page: Math.ceil(total/itemsPerPage)
		});

	});
}

// Actualizar los datos del usuario
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	// borrar la propiedad password
	delete update.password;

	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
	}

	User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

		return res.status(200).send({user: userUpdated});
	});
}

// Imagen de perfil
function uploadImage(req, res){
	var userId = req.params.id;



	if(req.files){
		var file_path = req.files.image.path;
		// console.log(file_path);
		var file_split = file_path.split('\\');
		// console.log(file_split);
		var file_name = file_split[2];
		// console.log(file_name);
		var ext_split = file_name.split('\.');
		console.log(ext_split);
		var file_ext = ext_split[1];
		console.log(file_ext);

		if(userId != req.user.sub){
			return removeFilesOfMedia(res, file_path, 'No tienes permiso para actualizar la imagen de usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			// Actualizar documento de usuario logueado
			User.findByIdAndUpdate(userId, {image: file_name}, { new:true}, (err, userUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar la imagen'});

				return res.status(200).send({user: userUpdated});
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
	var path_file = './media/users/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen'});
		}
	});
}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageFile
}
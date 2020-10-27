'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

// Método de prueba
function pruebaMessage(req, res){
	res.status(200).send({message: 'Hola desde el controlador de Messages'});
}

// Método para enviar mensajes entre los usuarios
function saveMessage(req, res){
	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Envía los datos necesarios'});

	var message = new Message();
	message.emitter = req.user.sub;
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().unix();
	message.viewed = 'false';

	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!messageStored) return res.status(404).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({message: messageStored});
	});
}

// Devolver mensajes recibidos
function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({receiver: userId}).populate('emitter', '_id name last_name nick_name image').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages,
			page: page
		})
	});
}

// Devolver mensajes enviados
function getEmittedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({emitter: userId}).populate('emitter receiver', '_id name last_name nick_name image').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages,
			page: page
		})
	});
}

// Devolver mensajes no leídos
function getUnviewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver: userId, viewed: 'false'}).exec((err, counts) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		return res.status(200).send({
			'unviewed': counts
		});
	});
}

// Marcar mensajes no leídos como leídos
function setViewedMessages(req, res){
	var userId = req.user.sub;

	Message.update(
		{receiver: userId, viewed: 'false'},
		{viewed: 'true'},
		{'multi': true},
		(err, messagesUpdated) => {
			if(err) return res.status(500).send({message: 'Error en la petición'});

			return res.status(200).send({
				messages: messagesUpdated
			});

	});
}

module.exports = {
	pruebaMessage,
	saveMessage,
	getReceivedMessages,
	getEmittedMessages,
	getUnviewedMessages,
	setViewedMessages
}
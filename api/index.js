'use strict'

// CONEXIÓN A LA DB
var mongoose = require('mongoose');

// CARGAR app.js
var app = require('./app');

// Indicar el puerto
var port = 3800;

// CONEXIÓN A LA DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/acem', { useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => {
		console.log("Hola, la conexion a la base de datos ha sido existosa")

		// CREAR SERVIDOR
		app.listen(port, () => {
			console.log("Servidor corriendo en http://localhost:3800");
		});
	})
	.catch(err => console.log(err));




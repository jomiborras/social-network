'use strict'

// 1. CONECTAR CON EXPRESS
var express = require('express');
// 2. CONECTAR BODYPARSER
var bodyParser = require('body-parser');

// 3. LLAMAR A EXPRESS
var app = express();

// Cargar Rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');

// 4. Cargar Middlewares (métodos que se ejecutan antes de llegar a un controlador)
app.use(bodyParser.urlencoded({extended:false}));
	// 4.1 Convierte lo que llegue como petición del body a JSON
app.use(bodyParser.json());

// Cargar cors y cabezaras

// Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);


// EXPORTAR
module.exports = app;
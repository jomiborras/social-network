'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './media/users'});


api.get('/home', UserController.home);

api.get('/prueba-user', md_auth.ensureAuth, UserController.pruebas);

api.post('/register', UserController.saveUser);

api.post('/login', UserController.loginUser);

api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);

api.get('/publication-like/:publication/:user', md_auth.ensureAuth, UserController.getUserLike);

api.get('/publication-likes/:publication/:page?', md_auth.ensureAuth, UserController.getUsersLikes);

api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);

api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);

api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

api.post('/upload-profile-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

api.get('/user-image/:imageFile', UserController.getImageFile);

module.exports = api;
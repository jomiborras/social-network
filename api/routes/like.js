'use strict'

var express = require('express');
var LikeController = require('../controllers/like');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/prueba-like', md_auth.ensureAuth, LikeController.pruebaLike);

api.post('/like', md_auth.ensureAuth, LikeController.saveLike);

api.delete('/like/:id', md_auth.ensureAuth, LikeController.unLike);

api.get('/likes/:id?', md_auth.ensureAuth, LikeController.getLikes);

module.exports = api;
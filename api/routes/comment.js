'use strict'

var express = require('express');
var CommentController = require('../controllers/comment');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/prueba-comment', md_auth.ensureAuth, CommentController.pruebaComment);

api.post('/comment/:publication', md_auth.ensureAuth, CommentController.saveComment);

api.get('/comment/:id', md_auth.ensureAuth, CommentController.getComment);

api.get('/comments/:publication/:page?', md_auth.ensureAuth, CommentController.getComments);

api.put('/edit-comment/:id', md_auth.ensureAuth, CommentController.editComment);

api.delete('/comment/:id', md_auth.ensureAuth, CommentController.deleteComment);

module.exports = api;
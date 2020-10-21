'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './media/publications'});

api.get('/pruebaPublication', md_auth.ensureAuth, PublicationController.pruebaPublication);

api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);

api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);

api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);

api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);

api.post('/upload-publication-image/:id', [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);

api.get('/get-publication-image/:imageFile', PublicationController.getImageFile);

module.exports = api;
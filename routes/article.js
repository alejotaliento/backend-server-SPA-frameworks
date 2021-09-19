'use strict'

const express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

// Configurar el modulo del connect multi-party router/article.js
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles' }); //Middleware

// Rutas de prueba
router.post('/datos-servidor', ArticleController.datosServidor);
router.get('/test-de-controlador', ArticleController.test);


// Rutas utiles
router.post('/save', ArticleController.save);   // Agarrar los parametros por post
router.get('/articles/:last?', ArticleController.getArticles);   // Obtener los parametros por get
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update); //Actualizar los parametros por put
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search-article/:search', ArticleController.search);

module.exports = router;
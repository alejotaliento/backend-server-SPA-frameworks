'use strict'

const validator = require('validator');
const fs = require('fs');
const path = require('path');

const Article = require('../models/article');
const { param } = require('../routes/article');
const article = require('../models/article');

var controller = {

    datosServidor: (req, res) => {
        return res.status(200).send({
            descripcion: "Probando api rest con Node js",
            autor: "Alejo taliento",
            url: 'alejotaliento.com',
        });

        //search http codes 
    },

    test: (req, res) => {
        return res.status(200).send({
            message: "Soy la accion test de mi controlador de articulos"
        });
    },


    // Guardar articulos
    save: (req, res) => {
        var params = req.body;

        // Validar datos (validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {

            // Crear objeto que se va a guardar
            var article = new Article();

            // Asignar valores al objeto
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else {
                article.image = null;
                console.log('error al subir la imagen');
            }

            // Guardar articulo
            article.save((err, articleStored) => {

                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se a guardado'
                    });
                }

                // Devolver repuesta
                return res.status(200).send({
                    status: 'success',
                    article
                });

            });


        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },


    // Traer articulos
    getArticles: (req, res) => {

        var query = Article.find({});

        // Traer ultimos articulos
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //Find para sacar o buscar los datos de la bd

        query.sort('-_id').exec((err, articles) => { // query.sort('_id').exec((err, articles) => PARA ORDEN ASCENDENTE

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    },

    getArticle: (req, res) => {

        // Agarrar el id de la url
        var articleId = req.params.id;

        // Cimprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }

            //Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    //Actualizar articulo
    update: (req, res) => {
        //Agarrar id del articulo de la url
        var articleId = req.params.id;

        //Agarrar los datos que llegan por put
        var params = req.body;

        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title); // cuando params.titel ESTE VACIO validate_title=true
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            // Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if (!articleUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'No existe el articulo que quiere actualizar'
                    });
                }
                //Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    delete: (req, res) => {
        //Agarrar el id de la url
        var articleId = req.params.id;

        // Find and Delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        });
    },
    upload: (req, res) => {
        // Configurar el modulo del connect multi-party router/article.js (hecho)

        // Agarrar el fichero de la peticion
        var file_name = 'imagen not found...';

        if (!req.files) {
            return req.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // ADVERTENCIA EN LINUX O MAC
        // var file_split = file_path.split('/');

        //Nombre del archivo
        var file_name = file_split[2];

        //Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extencion (solo imagenes), si es valido borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' && file_ext != 'jfif') {

            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });

        } else {   // Si todo es valido
            var articleId = req.params.id;

            if (articleId) {
                
                // Buscar el articulo, asignarlo el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

                    if (err || !article) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });

                });

            } else {

                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });

            }
        }
    }

    ,

    getImage: (req, res) => {
        //Sacar el fichero que llega por la url
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(500).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {
        //Sacar el String a buscar
        var searchString = req.params.search;

        //Find or (para varias condiciones)
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },// Cuando el titulo contenga el searchSting, opciones
                { "content": { "$regex": searchString, "$options": "i" } }// Cuando el contenido contenga el searchSting, opciones
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {  //ejecuta la query y saca los datos de la bd

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error: no existen articulos que coincidan con tu busqueda'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    }

}; // end controller

module.exports = controller;
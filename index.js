'use strict'

// Conxecion a la base de datos

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('Succes conection');
 
        // Crear servidor
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost: ' + port);
        })
    
    });

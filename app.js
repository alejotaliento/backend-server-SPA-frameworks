'use strict'

// Servidor Web [Crear rutas, Recibir peticiones, etc]

// Cargar modulos de node para cargar el servidor
var express = require("express");
var bodyParser = require("body-parser");
const article = require("./models/article");

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
const article_routes = require('./routes/article');

// MiddLewares (Es algo que se ejecutar antes de cargar una ruta o una url de la app)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Convertir cualquier tipo de peticion que llega a un OBJ-Json


// CORS = acceso cruzado entre dominio (permite peticiones desde el Fontend)
// Configurar cabeceras y cors a travez de un MIDDLEWARE
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Aniadir prefijos a rutas (Cargar rutas)
app.use('/api', article_routes);

// Exportar modulo (archivo actual)
module.exports = app;
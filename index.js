//IMPORTACION DE ARCHIVOS
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // https://www.npmjs.com/package/cors

const { dbConnection } = require('./database/config');

//CREA EL SERVIDOR EXPRESS
const app = express();

//CONFIGURAR CORS (MIDDLEWARE) EJECUTA SIEMPRE ANTES DE CUALQUIER OTRA
app.use(cors());

//DATABASE
dbConnection();

//RUTAS
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'hola mundo 2'
    })
});

//SERVER RUN
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
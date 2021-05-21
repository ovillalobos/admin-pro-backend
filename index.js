//IMPORTACION DE ARCHIVOS
require('dotenv').config();
const path = require('path'); //NO SE IMPORTA DE NINGUN LUGAR YA ES PARTE DE NODE

const express = require('express');
const cors = require('cors'); // https://www.npmjs.com/package/cors

const { dbConnection } = require('./database/config');

//CREA EL SERVIDOR EXPRESS
const app = express();

//CONFIGURAR CORS (MIDDLEWARE) EJECUTA SIEMPRE ANTES DE CUALQUIER OTRA
app.use(cors());

//LECTURA Y PARSEO DEL BODY
app.use(express.json());

//DATABASE
dbConnection();

//DIRECTORIO PUBLICO AQUI SE METE TODO EL CODIGO DE ANGULAR DESPUES DE COMPILARLO ( ng build --prod ) Y SE COPIA TODO EL DIST

app.use(express.static('public'));

//RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/upload'));

app.use('/api/login', require('./routes/auth'));

//ULTIMO PASO PARA LAS RUTAS EN CASO DE QUE NO ENCUENTRE LA RUTA PARA PRODUCTION
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

//SERVER RUN
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
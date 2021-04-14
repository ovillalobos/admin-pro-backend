/*
FILE: CONSULTA TODO
PATH: /api/todo/:busqueda
PATH: /api/todo/coleccion/:tabla/:busqueda
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getBusquedaTodo, getDocumentosCollecion } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', [
    validarJWT
], getBusquedaTodo);

router.get('/coleccion/:tabla/:busqueda', [
    validarJWT
], getDocumentosCollecion);

module.exports = router;
/*
FILE: UPLOAD
PATH: /api/uploads/
*/

const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');

const { fileUpload, returnImage } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.get('/:tipo/:fotoId', [], returnImage);

router.put('/:tipo/:id', [
    validarJWT
], fileUpload);

module.exports = router;
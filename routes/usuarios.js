/*
PATH: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');

const router = Router();

router.get('/', validarJWT, getUsuarios);

//Adding middleware
router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El formato del correo no es correcto').isEmail(),
        validarCampos
    ],
    crearUsuario
);

//Adding middleware
router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('email', 'El formato del correo no es correcto').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario
);

router.delete('/:id', [validarJWT], borrarUsuario);

module.exports = router;
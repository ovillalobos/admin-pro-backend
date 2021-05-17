/*
FILE: MEDICOS
PATH: /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, getMedicoByID, crearMedico, actualizarMedico, borrarMedicos } = require('../controllers/medicos');

const router = Router();

//GET - TODOS LOS MEDICOS
router.get('/', validarJWT, getMedicos);
//GET - MEDICO EN ESPECIFICO
router.get('/:id', [
    validarJWT
], getMedicoByID);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser valido').isMongoId(),
    validarCampos
], crearMedico);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El hospital es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser valido').isMongoId(),
    validarCampos
], actualizarMedico);

router.delete('/:id', validarJWT, borrarMedicos);

module.exports = router;
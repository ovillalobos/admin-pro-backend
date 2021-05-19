const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const { response } = require('express');

const validarJWT = (req, res = response, next) => {
    //LEER TOKEN
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            status: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.uid = uid;

        next(); //SI CUMPLE TODAS LAS CONDICIONES DEJA PASAR LA OPERACION EL MIDDLEWARE
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error en JWT inesperado... revisar logs'
        });
    }
}

const validarADMIN_ROLE = async(req, res = response, next) => {

    const uid = req.uid; //porque ya se validar en validarJWT        

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                status: false,
                msg: 'El usuario no existe'
            });
        }

        if (usuarioDB.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                status: false,
                msg: 'No tiene privilegios para realizar esta tarea'
            });
        }

        next(); //SI CUMPLE TODAS LAS CONDICIONES DEJA PASAR LA OPERACION EL MIDDLEWARE
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error en la validacion inesperado... contactar al administrador'
        });
    }

}

const validarADMIN_ROLE_MISMO_USUARIO = async(req, res = response, next) => {

    const uid = req.uid; //porque ya se validar en validarJWT      
    const id = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                status: false,
                msg: 'El usuario no existe'
            });
        }

        if (usuarioDB.role === "ADMIN_ROLE" || uid === id) {
            next(); //SI CUMPLE TODAS LAS CONDICIONES DEJA PASAR LA OPERACION EL MIDDLEWARE
        } else {
            return res.status(403).json({
                status: false,
                msg: 'No tiene privilegios para realizar esta tarea'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error en la validacion inesperado... contactar al administrador'
        });
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_MISMO_USUARIO
}
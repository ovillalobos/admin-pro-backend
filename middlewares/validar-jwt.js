const jwt = require('jsonwebtoken');
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

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error en JWT inesperado... revisar logs'
        })
    }
}

module.exports = {
    validarJWT,
}
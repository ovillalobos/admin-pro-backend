const { response } = require('express');
const bcrypt = require('bcryptjs');

const usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        //VERIFICAR EMAIL
        const usuarioDB = await usuario.findOne({ email });

        if (!usuarioDB) {
            res.status(400).json({
                status: false,
                msg: 'El correo no es valido'
            });
        }

        //VERIFICAR PASSWORD
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            res.status(400).json({
                status: false,
                msg: 'El password no es valido'
            });
        }

        //GENERAR TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            status: true,
            msg: 'Login',
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

module.exports = {
    login
}
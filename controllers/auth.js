const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFontEnd } = require('../helpers/menu-frontend');

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        //VERIFICAR EMAIL
        const usuarioDB = await Usuario.findOne({ email });

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
            token,
            menu: getMenuFontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const googleSignIn = async(req, res = response) => {
    try {
        const googleToken = req.body.token;
        const { name, email, picture } = await googleVerify(googleToken);

        //VERIFICAR SI ESE EMAIL YA EXISTE EN NUESTRA DB
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            //SINO EXISTE EL USUARIO
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }
        //GUARDAR EN LA BASE DE DATOS
        await usuario.save();

        //GENERAR TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            status: true,
            msg: 'Google Sign-In',
            token,
            menu: getMenuFontEnd(usuario.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Token no valido'
        });
    }
}

const renewToken = async(req, res = response) => {
    try {
        const uid = req.uid;

        //GENERAR TOKEN - JWT
        const token = await generarJWT(uid);

        //OBTENER EL USUARIO POR UID
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                status: false,
                msg: 'No se encontro el registro con el ID ' + uid
            })
        }

        res.status(200).json({
            status: true,
            msg: 'renewToken',
            token,
            usuarioDB,
            menu: getMenuFontEnd(usuarioDB.role)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Token no valido'
        });
    }
}
module.exports = {
    login,
    googleSignIn,
    renewToken
}
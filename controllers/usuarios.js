const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        status: true,
        msg: 'Registros encontrados correctamente',
        usuarios,
        uid: req.uid //Se recupera del Middleware validar-JWT
    })
}

const crearUsuario = async(req, res = response) => {
    const { email, password, nombre } = req.body; // Parametros por medio del cuerpo

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                status: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario(req.body);
        //Encryptar Contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // ASYNC/AWAIT -> espera a que se cumpla la tarea para continuar
        await usuario.save();

        //GENERAR TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            status: true,
            msg: 'Registro creado correctamente',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const actualizarUsuario = async(req, res = response) => {
    // VALIDAR TOKEN

    const uid = req.params.id; //PARAMETROS URL GET

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            res.status(400).json({
                status: false,
                msg: 'No se encontro el registro con el ID ' + uid
            })
        }

        //ACTUALIZACION
        //const campos = req.body; //SIN EXTRACCION TIENES QUE HACER DELETE
        const { password, google, email, ...campos } = req.body; //CON EXTRACCION ELIMINANDO {password, google}

        //-> ELIMINAR CAMPOS QUE NO QUEREMOS ACTUALIZAR
        if (usuarioDB.email !== email) {
            const exiteEmail = await Usuario.findOne({ email });
            if (exiteEmail) {
                res.status(400).json({
                    status: false,
                    msg: 'No se puede actualizar, hay un registro con el mismo email ' + req.body.email
                })
            }
        }
        // SIN EXTRACCION delete campos.password;
        // SIN EXTRACCION delete campos.google;

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            status: true,
            msg: 'Registro actualizado correctamente',
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id; //PARAMETROS URL GET

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            res.status(400).json({
                status: false,
                msg: 'No se encontro el registro con el ID ' + uid
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            status: true,
            msg: 'Registro eliminado correctamente',
            id: uid
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
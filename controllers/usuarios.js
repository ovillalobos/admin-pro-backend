const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0; // En caso de venir vacio poner 0
        const limit = Number(req.query.limit) || 5; // En caso de venir vacio poner 5
        /*
        const usuarios = await Usuario.find({}, 'nombre email role google')
            .skip(desde)
            .limit(5);

        const total = await Usuario.count();
        */

        const [usuarios, total] = await Promise.all([
            Usuario.find({}, 'nombre email role google img').skip(desde).limit(limit),
            Usuario.count()
        ])

        res.json({
            status: true,
            msg: 'Registros encontrados correctamente',
            usuarios,
            total: total,
            uid: req.uid //Se recupera del Middleware validar-JWT
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
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
            return res.status(400).json({
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

        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                status: false,
                msg: 'Los usuarios de Google no pueden cambiar su correo electronico'
            })
        }

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
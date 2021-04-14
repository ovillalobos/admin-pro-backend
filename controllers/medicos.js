const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
    try {
        const medicos = await Medico.find()
            .populate('usuario', 'nombre email img')
            .populate('hospital', 'nombre');

        res.json({
            status: true,
            msg: 'La consulta se realizo correctamente',
            medicos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const crearMedico = async(req, res = response) => {
    try {
        const uid = req.uid;

        const medico = new Medico({
            usuario: uid,
            ...req.body
        });

        const medicoDB = await medico.save();

        res.json({
            status: true,
            msg: 'Registro creado correctamente',
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const actualizarMedico = async(req, res = response) => {
    try {
        res.json({
            status: true,
            msg: 'actualizarMedico'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const borrarMedicos = async(req, res = response) => {
    try {
        res.json({
            status: true,
            msg: 'borrarMedicos'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedicos
}
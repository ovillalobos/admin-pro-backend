const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {
    try {
        //POPULATE FUNCIONA PARA HACER RELACIONES ENTRE DOCUMENTOS
        const hospitales = await Hospital.find()
            .populate('usuario', 'nombre email img');

        res.json({
            status: true,
            msg: 'La consulta se realizo correctamente',
            hospitales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const crearHospital = async(req, res = response) => {
    try {
        const uid = req.uid;
        const hospital = new Hospital({
            usuario: uid,
            ...req.body
        });

        const hospitalDB = await hospital.save();

        res.json({
            status: true,
            msg: 'Registro creado correctamente',
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const actualizarHospital = async(req, res = response) => {
    try {
        res.json({
            status: true,
            msg: 'actualizarHospital'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const borrarHospital = async(req, res = response) => {
    try {
        res.json({
            status: true,
            msg: 'borrarHospital'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
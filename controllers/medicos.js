const { response } = require('express');

const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getMedicos = async(req, res = response) => {
    try {
        const medicos = await Medico.find()
            .populate('usuario', 'nombre email img')
            .populate('hospital', 'nombre img');

        if (medicos) {
            res.json({
                status: true,
                msg: 'La consulta se realizo correctamente',
                medicos
            });
        } else {
            res.json({
                status: false,
                msg: 'No se encontro ningun registro'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        })
    }
}

const getMedicoByID = async(req, res = response) => {
    const medicoID = req.params.id;

    try {
        const medicos = await Medico.findById(medicoID)
            .populate('usuario', 'nombre email img')
            .populate('hospital', 'nombre img');

        if (medicos) {
            res.json({
                status: true,
                msg: 'La consulta se realizo correctamente',
                medicos
            });
        } else {
            res.json({
                status: false,
                msg: 'No se encontro ningun registro'
            });
        }
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
    const medicoID = req.params.id;
    const hospitalID = req.body.hospital;
    const userID = req.uid;

    try {
        const medico = await Medico.findById(medicoID);
        const hospital = await Hospital.findById(hospitalID);

        if (!medico) {
            return res.status(400).json({
                status: true,
                msg: 'No se encontro el registro por ID'
            });
        }

        if (!hospital) {
            return res.status(400).json({
                status: true,
                msg: 'No se encontro el registro por ID'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: userID
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(medicoID, cambiosMedico, { new: true });

        res.status(200).json({
            status: true,
            msg: 'El registro se ha actualizado correctamente',
            medico: medicoActualizado
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
    const medicoID = req.params.id;

    try {
        const medico = await Medico.findById(medicoID);

        if (!medico) {
            return res.status(400).json({
                status: true,
                msg: 'No se encontro el registro por ID'
            });
        }

        const medicoEliminado = await Medico.findByIdAndDelete(medicoID);

        res.status(200).json({
            status: true,
            msg: 'El registro se ha eliminado correctamente'
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
    getMedicoByID,
    crearMedico,
    actualizarMedico,
    borrarMedicos
}
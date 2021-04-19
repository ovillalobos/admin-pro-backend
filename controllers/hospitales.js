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
    const hospitalID = req.params.id;
    const userID = req.uid; //Lo obtenemos del JWT

    try {
        const hospital = await Hospital.findById(hospitalID);

        if (!hospital) {
            return res.status(400).json({
                status: true,
                msg: 'No se encontro el registro por ID'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: userID
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalID, cambiosHospital, { new: true });

        res.status(200).json({
            status: true,
            msg: 'El registro se ha actualizado correctamente',
            hospital: hospitalActualizado
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
    const hospitalID = req.params.id;

    try {
        const hospital = await Hospital.findById(hospitalID);

        if (!hospital) {
            return res.status(400).json({
                status: true,
                msg: 'No se encontro el registro por ID'
            });
        }

        const hospitalEliminado = await Hospital.findOneAndDelete(hospitalID);

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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
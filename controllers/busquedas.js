const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getBusquedaTodo = async(req, res = response) => {
    const busqueda = req.params.busqueda; //PARAMETROS URL GET
    const regex = new RegExp(busqueda, 'i'); //EXPRESION REGULAR

    try {
        const [usuarios, usuarios_total,
            medicos, medicos_total,
            hospitales, hospitales_total
        ] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Usuario.find({ nombre: regex }).countDocuments(),
            Medico.find({ nombre: regex }),
            Medico.find({ nombre: regex }).countDocuments(),
            Hospital.find({ nombre: regex }),
            Hospital.find({ nombre: regex }).countDocuments()
        ]);

        res.json({
            status: true,
            msg: 'Registros encontrados correctamente',
            usuarios,
            usuarios_total,
            medicos,
            medicos_total,
            hospitales,
            hospitales_total
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};

const getDocumentosCollecion = async(req, res = response) => {
    const tabla = req.params.tabla; //PARAMETROS URL GET
    const busqueda = req.params.busqueda; //PARAMETROS URL GET
    const regex = new RegExp(busqueda, 'i'); //EXPRESION REGULAR

    let res_data = [];
    let resData_total = [];

    try {
        switch (tabla) {
            case 'medicos':
                res_data = await Medico.find({ nombre: regex })
                    .populate('usuario', 'nombre img')
                    .populate('hospital', 'nombre img');
                resData_total = await Medico.find({ nombre: regex }).countDocuments();
                break;
            case 'hospitales':
                res_data = await Hospital.find({ nombre: regex })
                    .populate('usuario', 'nombre img');
                resData_total = await Hospital.find({ nombre: regex }).countDocuments();
                break;
            case 'usuarios':
                res_data = await Usuario.find({ nombre: regex });
                resData_total = await Usuario.find({ nombre: regex }).countDocuments();
                break;
            default:
                return res.status(400).json({
                    status: false,
                    msg: 'El nombre de la tabla debe ser usuarios/medicos/hospitales'
                });
        }

        res.json({
            status: true,
            msg: 'Registros encontrados correctamente',
            data: res_data,
            total_reg: resData_total,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};


module.exports = {
    getBusquedaTodo,
    getDocumentosCollecion
}
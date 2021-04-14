const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen')

const fileUpload = async(req, res = response) => {
    const tipo = req.params.tipo; //PARAMETROS URL GET
    const id = req.params.id; //PARAMETROS URL GET

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            status: false,
            msg: 'El tipo debe ser usuarios/medicos/hospitales'
        });
    }

    //VALIDAR QUE EXITA UN ARCHIVO
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            status: false,
            msg: 'No hay ningun archivo'
        });
    }

    //PROCESAR LA IMAGEN
    try {
        const file = req.files.imagen; //imagen ES EL NOMBRE DEL PARAMETRO
        const nombreCortado = file.name.split('.'); //wolverine.1.3.jpg
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        //VALIDAR EXTENSIONES
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).json({
                status: false,
                msg: 'No es una extension permitida (png / jpg / jpeg / gif)'
            });
        }

        //GENERAR EL NOMBRE DEL ARCHIVO
        const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

        //PATH PARA GUARDAR LA IMAGEN
        const path = `./uploads/${ tipo }/${ nombreArchivo }`;

        //USE THE mv() METHOD TO PLACE THE FILE SOMEWHERE ON YOUR SERVER
        file.mv(path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: false,
                    msg: 'Error al mover la imagen',
                });
            }

            //ACTUALIZAR LA BASE DE DATOS
            const seActualizo = actualizarImagen(tipo, id, nombreArchivo);

            res.status(200).json({
                status: true,
                msg: 'File Upload',
                nombreArchivo
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};

const returnImage = async(req, res = response) => {
    const tipo = req.params.tipo; //PARAMETROS URL GET
    const fotoId = req.params.fotoId; //PARAMETROS URL GET

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ fotoId }`);

    //IMAGEN POR DEFECTO
    if (fs.existsSync(pathImg)) {
        res.status(200).sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-image.png`);
        res.status(200).sendFile(pathImg);
    }
};

module.exports = {
    fileUpload,
    returnImage
}
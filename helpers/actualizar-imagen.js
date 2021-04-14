const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    //VALIDAR SI EXISTE LA IMAGEN
    if (fs.existsSync(path)) {
        //BORRAR LA IMAGEN ANTERIOR
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {
    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);

            if (!medico) {
                console.log('No se encontro el registro de Medico x ID');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);
            medico.img = nombreArchivo;
            await medico.save();
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                console.log('No se encontro el registro de Hospital x ID');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);
            hospital.img = nombreArchivo;
            await hospital.save();
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No se encontro el registro de Usuario x ID');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);
            usuario.img = nombreArchivo;
            await usuario.save();
            break;
    }

    return true;
}

module.exports = {
    actualizarImagen
}
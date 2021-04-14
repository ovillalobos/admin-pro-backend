const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
}, { collection: 'medicos' });

//CONFIGURACION DE SCHEMA
MedicoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject(); //Extraccion

    return object;
});

module.exports = model('Medico', MedicoSchema);
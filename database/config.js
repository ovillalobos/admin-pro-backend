const mongoose = require('mongoose');

// ASYNC -> REGRESA UNA PROMESA
const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');
    } catch (error) {
        console.log(error); // Muestra el error
        throw new Error('Error al iniciar la BD, ver logs'); // Detiene toda la ejecucion
    }
};

module.exports = {
    dbConnection
}
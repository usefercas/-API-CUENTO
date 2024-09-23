const express = require('express'); // Importa Express para crear el servidor web
const cors = require('cors'); // Importa CORS para permitir solicitudes desde otros dominios
const mongoose = require('mongoose'); // Importa Mongoose para interactuar con MongoDB
const app = express(); // Crea una instancia de la aplicación Express

const URI = process.env.MONGODB_URI || "mongodb+srv://usefercasta:usefercasta@api-cuento-cluster.jgfxf.mongodb.net/cuentos_lucas?retryWrites=true&w=majority"; // URI de MongoDB

// Conectar solo si no estamos en el entorno de prueba
if (process.env.NODE_ENV !== 'test') {
    // Conecta Mongoose a la base de datos
    mongoose.connect(URI)
    .then(() => console.info(`Successfully connected to the database ${URI}`)) // Mensaje de éxito si la conexión es exitosa
    .catch((error) => {
        console.error(`An error occurred trying to connect to the database ${URI}`, error); // Mensaje de error si la conexión falla
        process.exit(1); // Sale del proceso con un código de error
    });

    // Maneja la señal de interrupción para cerrar la conexión de MongoDB antes de salir
    process.on("SIGINT", async () => {
        try {
            await mongoose.connection.close(); // Cierra la conexión a la base de datos
            console.log("Mongoose disconnected on app termination"); // Mensaje de éxito al cerrar la conexión
            process.exit(0); // Sale del proceso con un código de éxito
        } catch (error) {
            console.error("Error disconnecting from MongoDB:", error); // Mensaje de error si al cerrar la conexión falla
            process.exit(1); // Sale del proceso con un código de error
        }
    });
}

// Middleware
app.use(cors()); // Usa el middleware CORS para permitir solicitudes de otros dominios
app.use(express.json()); // Usa el middleware para parsear cuerpos de solicitudes en formato JSON
app.use(express.urlencoded({ extended: true })); // Usa el middleware para parsear cuerpos de solicitudes con datos codificados en URL

// Montar las rutas
app.use('/api/cuentos', require('./routes/cuentos.routes')); // Monta las rutas de cuentos en el prefijo '/api/cuentos'

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime la traza del error en la consola
    res.status(500).json({ message: 'Something went wrong!', error: err.message }); // Envía una respuesta JSON con el error
});

const PORT = process.env.PORT || 3000; // Define el puerto en el que se escuchará el servidor

// Si el archivo se ejecuta directamente, inicia el servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`); // Mensaje de éxito al iniciar el servidor
    });
}

module.exports = app; // Exporta la instancia de la aplicación para ser usada en otros archivos, como en pruebas

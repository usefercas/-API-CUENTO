const mongoose = require('mongoose');  // Importa la librería mongoose

const cuentoSchema = new mongoose.Schema({  // Define un nuevo esquema de Mongoose
    title: {  // Campo título
        type: String,  // Tipo de dato: cadena de texto
        required: [true, "Title is required"],  // El campo es obligatorio y requiere un valor
    },
    contenido: {  // Campo contenido
        type: String,  // Tipo de dato: cadena de texto
    },
    image: {  // Campo imagen
        type: String,  // Tipo de dato: cadena de texto
        default: "https://via.placeholder.com/150",  // Valor por defecto si no se proporciona uno
    },
});

const Cuento = mongoose.model("Cuento", cuentoSchema);  // Crea un modelo basado en el esquema

module.exports = Cuento;  // Exporta el modelo para usarlo en otros archivos


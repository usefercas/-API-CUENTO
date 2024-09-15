const mongoose = require('mongoose'); // Importa Mongoose para interactuar con la base de datos MongoDB
const Cuento = require('../models/cuento.model'); // Importa el modelo de Cuento para usarlo en las operaciones con la base de datos

// Controlador para crear un cuento
module.exports.crearCuento = (req, res) => {
    // Desestructura los datos del cuerpo de la solicitud (req.body)
    const { title, contenido, image } = req.body;

    // Crea una nueva instancia del modelo Cuento con los datos recibidos
    const nuevoCuento = new Cuento({
        title,
        contenido,
        image
    });

    // Guarda el nuevo cuento en la base de datos
    nuevoCuento.save()
        .then(cuentoGuardado => {
            // Responde con el cuento guardado y un código de estado 201 (creado)
            res.status(201).json(cuentoGuardado);
        })
        .catch(err => {
            // Maneja cualquier error durante la creación
            res.status(500).json({ message: 'Error al crear el cuento', error: err.message });
        });
};

// Controlador para obtener todos los cuentos
module.exports.obtenerCuentos = (req, res) => {
    // Busca todos los cuentos en la base de datos
    Cuento.find()
        .then(cuentos => {
            // Responde con todos los cuentos encontrados y un código de estado 200 (éxito)
            res.status(200).json(cuentos);
        })
        .catch(err => {
            // Maneja cualquier error durante la obtención
            res.status(500).json({ message: 'Error al obtener los cuentos', error: err.message });
        });
};

// Controlador para actualizar un cuento
module.exports.actualizarCuento = (req, res) => {
    // Desestructura el ID del parámetro de ruta (req.params) y los datos del cuerpo de la solicitud (req.body)
    const { id } = req.params;
    const { title, contenido, image } = req.body;

    // Imprime el ID y el cuerpo de la solicitud para depuración
    console.log(`ID recibido: "${id}"`);
    console.log(`Longitud del ID: ${id.length}`);
    console.log(`Datos recibidos: ${JSON.stringify(req.body)}`);

    // Verifica que el ID sea una cadena válida para ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        // Responde con un código de estado 400 (solicitud incorrecta) si el ID no es válido
        return res.status(400).json({ message: 'ID inválido' });
    }

    // Actualiza el cuento en la base de datos con el ID proporcionado
    Cuento.findByIdAndUpdate(id, { title, contenido, image }, { new: true })
        .then(cuentoActualizado => {
            if (!cuentoActualizado) {
                // Responde con un código de estado 404 (no encontrado) si el cuento no existe
                return res.status(404).json({ message: 'Cuento no encontrado' });
            }
            // Responde con el cuento actualizado y un código de estado 200 (éxito)
            res.status(200).json(cuentoActualizado);
        })
        .catch(err => {
            // Maneja cualquier error durante la actualización
            res.status(500).json({ message: 'Error al actualizar el cuento', error: err.message });
        });
};

// Controlador para eliminar un cuento
module.exports.eliminarCuento = (req, res) => {
    // Desestructura el ID del parámetro de ruta (req.params)
    const { id } = req.params;

    // Verifica que el ID sea una cadena válida para ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        // Responde con un código de estado 400 (solicitud incorrecta) si el ID no es válido
        return res.status(400).json({ message: 'ID inválido' });
    }

    // Busca y elimina el cuento en la base de datos con el ID proporcionado
    Cuento.findByIdAndDelete(id)
        .then(cuentoEliminado => {
            if (!cuentoEliminado) {
                // Responde con un código de estado 404 (no encontrado) si el cuento no existe
                return res.status(404).json({ message: 'Cuento no encontrado' });
            }
            // Responde con un mensaje de éxito y un código de estado 200 (éxito)
            res.status(200).json({ message: 'Cuento eliminado correctamente' });
        })
        .catch(err => {
            // Maneja cualquier error durante la eliminación
            res.status(500).json({ message: 'Error al eliminar el cuento', error: err.message });
        });
};

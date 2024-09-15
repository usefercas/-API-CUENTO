const express = require('express'); // Importa Express para crear el enrutador
const router = express.Router(); // Crea una instancia del enrutador de Express
const controller = require('../controllers/cuentos.controller'); // Importa el controlador de cuentos desde la ruta especificada

// Ruta para crear un cuento
router.post('/crear', controller.crearCuento);
// Este endpoint manejará las solicitudes POST a '/api/cuentos/crear'
// Llama al método `crearCuento` del controlador para procesar la solicitud de creación de un cuento

// Ruta para obtener cuentos
router.get('/obtener', controller.obtenerCuentos);
// Este endpoint manejará las solicitudes GET a '/api/cuentos/obtener'
// Llama al método `obtenerCuentos` del controlador para obtener todos los cuentos almacenados

// Ruta para actualizar un cuento
router.put('/actualizar/:id', controller.actualizarCuento);
// Este endpoint manejará las solicitudes PUT a '/api/cuentos/actualizar/:id'
// El `:id` en la URL es un parámetro de ruta que representa el ID del cuento a actualizar
// Llama al método `actualizarCuento` del controlador para procesar la solicitud de actualización del cuento con el ID proporcionado

// Ruta para eliminar un cuento
router.delete('/eliminar/:id', controller.eliminarCuento);
// Este endpoint manejará las solicitudes DELETE a '/api/cuentos/eliminar/:id'
// El `:id` en la URL es un parámetro de ruta que representa el ID del cuento a eliminar
// Llama al método `eliminarCuento` del controlador para procesar la solicitud de eliminación del cuento con el ID proporcionado

module.exports = router; // Exporta el enrutador para que pueda ser usado en otras partes de la aplicación

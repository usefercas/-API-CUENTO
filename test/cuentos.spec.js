// Importa las librerías necesarias para las pruebas
const request = require('supertest'); // Herramienta para realizar peticiones HTTP en pruebas
const mongoose = require('mongoose'); // Librería para interactuar con MongoDB
const { MongoMemoryServer } = require('mongodb-memory-server'); // Librería para crear una base de datos MongoDB en memoria para pruebas
const app = require('../app'); // Importa la aplicación Express para hacer las peticiones

let mongoServer; // Variable para almacenar la instancia de MongoMemoryServer

// Configuración de la base de datos en memoria antes de todos los tests
beforeAll(async () => {
    // Crea una instancia de MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    // Obtiene la URI de conexión a la base de datos en memoria
    const uri = mongoServer.getUri();

    // Conecta Mongoose a la base de datos en memoria
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Limpieza después de cada test
afterEach(async () => {
    // Borra la base de datos después de cada prueba
    await mongoose.connection.dropDatabase();
    // Elimina todos los documentos de la colección 'cuentos'
    await mongoose.connection.collection('cuentos').deleteMany({});
});

// Cierre de la conexión después de todos los tests
afterAll(async () => {
    // Desconecta Mongoose de la base de datos en memoria
    await mongoose.disconnect();
    // Detiene el servidor de MongoMemoryServer
    await mongoServer.stop();
});

// Describe el conjunto de pruebas para la API de cuentos
describe('Cuentos API', () => {
    jest.setTimeout(30000); // Aumenta el tiempo de espera para las pruebas a 30 segundos

    // Prueba para crear un nuevo cuento
    it('should create a new cuento', async () => {
        // Realiza una petición POST para crear un nuevo cuento
        const response = await request(app)
            .post('/api/cuentos/crear')
            .send({
                title: 'El gran libro',
                contenido: 'Contenido original.',
                image: 'https://via.placeholder.com/150',
            })
            .expect('Content-Type', /json/) // Verifica que el tipo de contenido de la respuesta sea JSON
            .expect(201); // Verifica que el código de estado de la respuesta sea 201 (Creado)

        // Verifica que la respuesta tenga la propiedad '_id'
        expect(response.body).toHaveProperty('_id');
        // Verifica que el título del cuento sea 'El gran libro'
        expect(response.body.title).toBe('El gran libro');
    });

    // Prueba para obtener todos los cuentos
    it('should get all cuentos', async () => {
        // Primero, crea un cuento para asegurarse de que haya datos en la base de datos
        await request(app)
            .post('/api/cuentos/crear')
            .send({
                title: 'El gran libro',
                contenido: 'Contenido original.',
                image: 'https://via.placeholder.com/150',
            });

        // Realiza una petición GET para obtener todos los cuentos
        const response = await request(app)
            .get('/api/cuentos/obtener')
            .expect('Content-Type', /json/) // Verifica que el tipo de contenido de la respuesta sea JSON
            .expect(200); // Verifica que el código de estado de la respuesta sea 200 (OK)

        // Verifica que la respuesta sea un array
        expect(response.body).toBeInstanceOf(Array);
        // Verifica que el array tenga al menos un elemento
        expect(response.body.length).toBeGreaterThan(0);
        // Verifica que el primer elemento del array tenga la propiedad 'title'
        expect(response.body[0]).toHaveProperty('title');
    });

    // Prueba para actualizar un cuento
    it('should update a cuento', async () => {
        // Primero, crea un cuento que se actualizará
        const createResponse = await request(app)
            .post('/api/cuentos/crear')
            .send({
                title: 'El gran libro',
                contenido: 'Contenido original.',
                image: 'https://via.placeholder.com/150',
            });

        // Obtiene el ID del cuento creado
        const cuentoId = createResponse.body._id;

        // Realiza una petición PUT para actualizar el cuento
        const updateResponse = await request(app)
            .put(`/api/cuentos/actualizar/${cuentoId}`)
            .send({
                title: 'El gran libro actualizado',
                contenido: 'Contenido actualizado.',
                image: 'https://via.placeholder.com/200',
            })
            .expect('Content-Type', /json/) // Verifica que el tipo de contenido de la respuesta sea JSON
            .expect(200); // Verifica que el código de estado de la respuesta sea 200 (OK)

        // Verifica que la respuesta tenga la propiedad '_id' y que el ID coincida con el del cuento actualizado
        expect(updateResponse.body).toHaveProperty('_id', cuentoId);
        // Verifica que el título del cuento se haya actualizado
        expect(updateResponse.body.title).toBe('El gran libro actualizado');
        // Verifica que el contenido del cuento se haya actualizado
        expect(updateResponse.body.contenido).toBe('Contenido actualizado.');
        // Verifica que la imagen del cuento se haya actualizado
        expect(updateResponse.body.image).toBe('https://via.placeholder.com/200');
    });

    // Prueba para eliminar un cuento
    it('should delete a cuento', async () => {
        // Primero, crea un cuento que se eliminará
        const createResponse = await request(app)
            .post('/api/cuentos/crear')
            .send({
                title: 'Cuento para eliminar',
                contenido: 'Contenido del cuento para eliminar.',
                image: 'https://via.placeholder.com/150',
            });

        // Obtiene el ID del cuento creado
        const cuentoId = createResponse.body._id;

        // Realiza una petición DELETE para eliminar el cuento
        const deleteResponse = await request(app)
            .delete(`/api/cuentos/eliminar/${cuentoId}`)
            .expect(200); // Verifica que el código de estado de la respuesta sea 200 (OK)

        // Verifica que la respuesta contenga el mensaje de éxito
        expect(deleteResponse.body).toEqual({ message: 'Cuento eliminado correctamente' });

        // Realiza una petición GET para verificar que el cuento ha sido eliminado
        const getResponse = await request(app)
            .get('/api/cuentos/obtener')
            .expect('Content-Type', /json/) // Verifica que el tipo de contenido de la respuesta sea JSON
            .expect(200); // Verifica que el código de estado de la respuesta sea 200 (OK)

        // Verifica que el cuento eliminado ya no esté en la lista de cuentos
        const deletedCuento = getResponse.body.find(cuento => cuento._id === cuentoId);
        expect(deletedCuento).toBeUndefined(); // Verifica que el cuento eliminado no exista en la respuesta
    });
});

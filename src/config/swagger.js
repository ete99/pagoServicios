const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pago de Servicios',
      version: '1.0.0',
      description: 'Documentación de la API de Pago de Servicios',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas a los archivos que contienen anotaciones de Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi:'3.0.0',
    info: {
      title: 'API REST - Productos y Categorias',
      version: '1.0.0',
      description: 'Documentacion generada con swagger-jsdoc y JSDoc annotations.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de Desarrollo',
      }
    ]
  },

  // Le indicamos donde buscar los comentarios
  apis: ['./src/routes/*.ts']
}

export const swaggerSpec = swaggerJSDoc(options);
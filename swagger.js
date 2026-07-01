const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mental Stress Detector API',
      version: '1.0.0',
      description: 'API documentation for the Mental Stress Detector application',
    },
    servers: [{ url: process.env.BASE_URL || 'http://localhost:3001' }],
  },
  apis: ['./routes/*.js'], // read JSDoc comments in route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

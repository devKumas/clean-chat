export * as swaggerUi from 'swagger-ui-express';
import swaggereJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: 'Clean Chat API',
      version: '1.0.0',
      description: '',
    },
    host: process.env.API_HOST,
    schemes: ['https', 'http'],
  },
  apis: [
    './src/models/*.ts',
    './src/routes/*.ts',
    './dist/models/*.js',
    './dist/routes/*.js',
    './swagger.yaml',
  ],
};

export const specs = swaggereJsdoc(options);

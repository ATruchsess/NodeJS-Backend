/* Alexander von Truchseß 26.11.2024
Creates a the swagger.json file from the endpoints defined by app.js
Adds a input field for the JWT Token, which is the replacement for the http cookie
*/

const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const outputFile = './swagger.json'; // File to store the generated Swagger doc
const endpointsFiles = ['./app.js']; // File(s) containing your routes
const port = process.env.PORT || 3000;

const doc = {
  info: {
    title: 'Swagger',
    description: 'Automatically generated Swagger documentation',
  },
  host: `localhost:${port}`,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // For documentation purposes
      },
    },
  },
  security: [
    {
      bearerAuth: [], // Only use bearerAuth
    },
  ],
  schemes: ['http'],
  basePath: "/",
  tags: [],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');
});

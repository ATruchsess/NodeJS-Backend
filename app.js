//Express
const express = require('express');
const app = express();

//Other
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

//Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

//Error
const errorHandler = require("./src/middlewares/errorHandler");

// Import Routes
const routes = require('./src/routes'); // Centralized routing

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure HTTP headers
if (process.env.USE_HTTPS){
  app.use(helmet.hsts());
}
app.use(morgan('dev')); // HTTP request logger
// Middleware for parsing URL-encoded data (optional, for form submissions)
app.use(express.urlencoded({ extended: true }));

// Parser for JWT Cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Use the routes
app.use('/api/v1', routes);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Rate Limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: process.env.MAX_RATE_LIMIT || 1200, // Limit each IP to 1200 requests per windowMs
});
app.use(limiter);

// Fallback for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
      message: 'Endpoint not found',
    });
  });

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
});
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Payload to embed in the JWT
const payload = {
    id: 1, // User ID
    name: 'John Doe', // User name
};

// Generate the token
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '300h' });
console.log('Generated JWT Token: Bearer', token);
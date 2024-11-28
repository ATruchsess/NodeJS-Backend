This project is a Node.js-based backend application with user authentication, rate limiting, and Swagger API documentation. It provides a solid foundation for applications, with features such as JWT-based authentication and centralized error handling.

Before you begin, ensure you have the following installed:

    Node.js: Download and install Node.js
    npm (comes with Node.js)
    Visual Studio Code (optional)

Setup and Installation
1. Install Dependencies

Run the following command to install all required dependencies:
```
npm install
```

2. Environment Variables

Create a .env file in the project root and set the necessary environment variables. Example:
If you do not add the DATABASE_FILE, then SQLite will use a in-memory database.

```
PORT=5000
USE_HTTPS=false

JWT_SECRET=3f9c3e4b5a71cff8b241d49590c909f3c91ec3c460c9a9c9ebcdef51ba3d241e
JWT_EXPIRES_TIME_HOURS=24 
PASSWORT_SALT=df9aks25dk24aijosdfj3209472e34ea

DATABASE_FILE=./database.sqlite

MAX_RATE_LIMIT=1200

MAX_FAILED_LOGIN_ATTEMPTS=10
```

3. Start the Development Server

To start the application in development mode, use:
```
npm run dev
```
The server will start on the port specified in the .env file and swagger on (default: http://localhost:5000/api-docs/#/).

4. Run Tests

To execute the test suite:
```
npm run test
```

Authentication Token creation for Swagger API

The Swagger API has a input field "Authorize" for the JWT token or Cookie to access protected endpoints. 
You can generate a token using the provided generateJWTToken.js utility.
Or Test the application with the Vue Frontend, which is more comfortable.

Generate a Token

Run the following script inside the Backend root directory:
```
node generateJWTToken.js
```

Alternatively, use the pre-generated token (valid for 300 hours):
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI2MzY0MjQsImV4cCI6MTczMzcxNjQyNH0.DD7mlvDqk_12O3tSXuyxX8Ib8ZuQpPAejP_SPqT2lkk
```
Insert this token into the "Authorize" input in the Swagger UI.



The project follows a modular structure for scalability and maintainability:

    /src
  
      /controllers     # Request handling and response logic

      /dataaccess      # Creation of the database

      /middlewares     # Middleware for authentication, validation, etc.

      /models          # Data models and sanitization logic

      /repositories    # Database interaction logic

      /routes          # API route definitions

      /services        # Business logic and service abstraction

      /utils           # Utility functions (e.g., token generation)

    swagger.json       # Swagger documentation
    
    generateJWTToken.js # Utility to create JWT tokens for testing



Features

✅ Authentication
    Secure JWT-based authentication.
    Rate and login attempts limiting to prevent brute-force attacks.

✅ Error Handling
    Centralized error handling for better debugging and user feedback.

✅ Swagger Integration
    Comprehensive API documentation with support for token authentication.

✅ Extensible Design
    Modular architecture for ease of maintenance and scalability.



What alternatives to JWT are there?
    
    Session-based Authentication:
        Traditional server-side sessions involve storing user authentication data on the server, typically in a database or in-memory storage.
    
    Windows Authentication: 
        Integrates directly with Active Directory, making it ideal for corporate networks where users already have domain accounts.
    
    OAuth 2.0:
        OAuth 2.0 is a robust protocol often used for delegated access like Google Accounts.

What are the best features of JWT?
    The Stateless Authentication with Self-contained Tokens gives it high flexibility and ease of use.

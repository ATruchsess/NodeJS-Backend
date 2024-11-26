Install dependencies
```
npm install
```

Run server
```
npm run dev
```

Test
```
npm run test
```

Use Swagger
After you started the backend the page will run under
```
http://localhost:5000/api-docs/#/
```

The Swagger API needs a valid token for a user, you can create a new one with the generateJWTToken.js utility inside the Backend directory.

For the 
```
JWT_SECRET=3f9c3e4b5a71cff8b241d49590c909f3c91ec3c460c9a9c9ebcdef51ba3d241e
```
I create one which is valid for 300 hours:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzI2MzY0MjQsImV4cCI6MTczMzcxNjQyNH0.DD7mlvDqk_12O3tSXuyxX8Ib8ZuQpPAejP_SPqT2lkk
```


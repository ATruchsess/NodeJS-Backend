/* Alexander von Truchseß 26.11.2024
Registration of routes and middleware for the User resource.

This  implements route definitions for the user API, adhering to RESTful conventions.
Middleware like `validateUser` ensures input validation, even if frontend performs checks, enforcing robust backend validation practices.
Dependency Injection is used to decouple services, repositories, and controllers, for good maintainability, scalability, and testability.
*/

const express = require("express");
const validateUser = require("../middlewares/validateUser");
const { authorization } = require("../middlewares/authMiddleware");

// Import dependencies
const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userService");
const UserController = require("../controllers/userController");
const db = require("../dataAccess/database");

// Dependency injection
const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

router.post(
  "/login",
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Authenticate user credentials and return a JWT token as an HTTP-only cookie'
  /* #swagger.parameters['body'] = {
      in: 'body',
      schema: {
            name: 'John Doe',
            password: '12345678',
        }
  } */
  (req, res) => userController.login(req, res)
);

router.get(
  "/",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint returns a list of all the users.'
  (req, res) => userController.getUsers(req, res)
);

router.get(
  "/current-user",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint returns the user corresponding to the JWT Token of the request.'
  (req, res) => userController.getCurrentUser(req, res)
);

router.get(
  "/:id",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint returns a user by id.'
  (req, res) => userController.getUserById(req, res)
);

router.post(
  "/",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint can be used to create a new user.'
  /* #swagger.parameters['body'] = {
      in: 'body',
      schema: {
            name: 'John Doe',
            password: '12345678',
        }
  } */
  validateUser,
  (req, res) => userController.createUser(req, res)
);

router.put(
  "/:id",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint can be used to update a existing user.'
  /* #swagger.parameters['body'] = {
      in: 'body',
      schema: {
            id: '',
            name: 'John Doe',
            password: '12345678',
        }
  } */
  validateUser,
  (req, res) => userController.updateUser(req, res)
);

router.delete(
  "/:id",
  authorization,
  // #swagger.tags = ['Users']
  // #swagger.summary = 'This endpoint can be used to delete a existing user.'
  (req, res) => userController.deleteUser(req, res)
);

module.exports = router;

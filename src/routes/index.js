/* Alexander von Truchseß 26.11.2024
This file serves as the main router entry point for the application.
Additional routes can be imported and mounted here as needed.
*/

const express = require("express");
const router = express.Router();

// Import individual routes
const userRoutes = require("./userRoutes");

// Mount routes
router.use("/users", userRoutes);

module.exports = router;

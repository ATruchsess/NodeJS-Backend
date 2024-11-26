// Alexander von Truchseß 26.11.2024
// Validation Middleware, to check the incoming values

const { body, validationResult } = require("express-validator");

const validateUser = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("name").isLength({ max: 60 }).withMessage("Name is to long"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUser;

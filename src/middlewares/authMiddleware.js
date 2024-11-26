/* Alexander von Truchseß 26.11.2024
 Authentication middleware for verifying JWT tokens.
 Protects routes by ensuring only authorization users can access them.
 Usage: Apply this middleware to routes requiring authentication.
*/

const jwt = require("jsonwebtoken");

exports.authorization = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

/* Alexander von Truchseß 26.11.2024
 Authentication middleware for verifying JWT tokens.
 Protects routes by ensuring only authorization users can access them.
 Usage: Apply this middleware to routes requiring authentication.
*/

const jwt = require("jsonwebtoken");

exports.authorization = (req, res, next) => {

  const tokenCookie = req.cookies.jwt;
  
  let token;
  if (tokenCookie){
    token = tokenCookie;
  }
  else {
    token = req.headers.authorization?.split(" ")[1];
  }

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "3f9c3e4b5a71cff8b241d49590c909f3c91ec3c460c9a9c9ebcdef51ba3d241e");
    
    req.user = verified;
    console.log(req.user);
    console.log(req.user);
    console.log(req.user);

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

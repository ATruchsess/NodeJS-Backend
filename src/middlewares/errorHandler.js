/* Alexander von Truchseß 26.11.2024
 Global error-handling middleware for the application.
 Captures and formats errors before sending a response to the client.
 Usage: Place this at the end of all route definitions.
*/

module.exports = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace (optional for debugging)

  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

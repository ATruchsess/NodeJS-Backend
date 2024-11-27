/* Alexander von Truchseß 26.11.2024
 Creates a new SQLite database in memory for demo purposes. 
 This in-memory database provides a simple and clean solution for running tests,
 ensuring that no persistent data is stored after a newstart.
 In a real environment, this Data Access Layer should be replaced 
 with a more robust database system, such as MongoDB or SQL Server.
*/

const sqlite3 = require("sqlite3").verbose();
const utilHelpers = require("../util/utilHelpers");

let db;
if (utilHelpers.isNullOrUndefined(process.env.DATABASE_FILE)) {
  db = new sqlite3.Database(":memory:");
} else {
  db = new sqlite3.Database(process.env.DATABASE_FILE);
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    failLoginCount INT NOT NULL DEFAULT 0
  )`);
});

module.exports = db;

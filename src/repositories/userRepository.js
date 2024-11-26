/* Alexander von Truchseß 26.11.2024
 Handles database operations for the "users" table.
 Uses plain SQL queries with parameterized statements for security. (Save syntax agains injection like "' OR 1=1 --";)
 Designed for simplicity and clarity without an ORM or generic solution.
*/

class UserRepository {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          console.error("Error fetching all users:", err.message);
          return reject(new Error("Database error while fetching all users"));
        }
        resolve(rows);
      });
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error(`Error fetching user with ID ${id}:`, err.message);
          return reject(new Error("Database error while fetching user by ID"));
        }
        resolve(row);
      });
    });
  }

  findByUsername(name) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
        if (err) {
          console.error(
            `Error fetching user with username "${name}":`,
            err.message
          );
          return reject(
            new Error("Database error while fetching user by username")
          );
        }
        resolve(row);
      });
    });
  }

  create(user) {
    return new Promise((resolve, reject) => {
      const { id, name, password } = user;
      this.db.run(
        "INSERT INTO users (id, name, password) VALUES (?, ?, ?)",
        [id, name, password],
        function (err) {
          if (err) {
            console.error("Error creating user:", err.message);
            return reject(new Error("Database error while creating user"));
          }
          resolve({ id, name, password });
        }
      );
    });
  }

  update(id, user) {
    return new Promise((resolve, reject) => {
      const { name, password } = user;
      this.db.run(
        "UPDATE users SET name = ?, password = ? WHERE id = ?",
        [name, password, id],
        function (err) {
          if (err) {
            console.error(`Error updating user with ID ${id}:`, err.message);
            return reject(new Error("Database error while updating user"));
          }
          resolve({ id, name, password });
        }
      );
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          console.error(`Error deleting user with ID ${id}:`, err.message);
          return reject(new Error("Database error while deleting user"));
        }
        resolve(true);
      });
    });
  }

  // Increment the failLoginCount for a user
  incrementFailLoginCount(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE users SET failLoginCount = failLoginCount + 1 WHERE id = ?",
        [userId],
        function (err) {
          if (err) {
            console.error(
              `Error incrementing failLoginCount for user ${userId}:`,
              err.message
            );
            return reject(
              new Error("Database error while updating failLoginCount")
            );
          }
          resolve(true);
        }
      );
    });
  }

  // Reset the failLoginCount for a user
  resetFailLoginCount(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE users SET failLoginCount = 0 WHERE id = ?",
        [userId],
        function (err) {
          if (err) {
            console.error(
              `Error resetting failLoginCount for user ${userId}:`,
              err.message
            );
            return reject(
              new Error("Database error while resetting failLoginCount")
            );
          }
          resolve(true);
        }
      );
    });
  }
}

module.exports = UserRepository;

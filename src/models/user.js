class User {
  constructor({ id, name, password, creationDate }) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.creationDate = creationDate || new Date();
  }

  /**
   * Generate a sanitized version of the user object for responses.
   * Avoids sending sensitive data like the password.
   */
  sanitize() {
    return {
      id: this.id,
      name: this.name,
      creationDate: this.creationDate,
    };
  }
}

module.exports = User;

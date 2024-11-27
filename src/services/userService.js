/* Alexander von Truchseß 26.11.2024
 This service encapsulates the business logic for user management, providing an abstraction layer 
 between the routes/controllers and the data layer (user repository). It ensures consistent handling 
 of user-related operations, enforces security measures, and supports future scalability.
*/

const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;

    //Comment out because it should run without creation of README File, if it would not be a demo application this would not be done.
    //if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  }

  async authenticateUser(name, password) {
    const maxFailedAttempts = process.env.MAX_FAILED_LOGIN_ATTEMPTS || 10; // Set default to 10 if env variable not defined

    const user = await this.userRepository.findByUsername(name);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Check if the user is locked out due to too many failed attempts
    if (user.failLoginCount >= maxFailedAttempts) {
      throw new Error("Account locked due to too many failed login attempts.");
    }

    // Validate password
    const hashedPassword = await this.hashPassword(password, name); // Hash the provided password
    // Compare the hashed password with the stored password
    if (hashedPassword !== user.password) {
      await this.userRepository.incrementFailLoginCount(user.id);

      if (user.failLoginCount + 1 >= maxFailedAttempts) {
        throw new Error(
          "Account locked due to too many failed login attempts."
        );
      }

      throw new Error("Invalid username or password");
    }

    await this.userRepository.resetFailLoginCount(user.id);

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET || "3f9c3e4b5a71cff8b241d49590c909f3c91ec3c460c9a9c9ebcdef51ba3d241e",
      { expiresIn: process.env.JWT_EXPIRES_TIME_HOURS || 24 }
    );

    // Return the token and sanitized user data
    return { token, user: new User(user).sanitize() };
  }

  async getUsers() {
    const users = await this.userRepository.findAll();
    return users.map((user) => new User(user).sanitize());
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return new User(user).sanitize();
  }

  //Could also use upsert function for insert or creation, but would keep one style for the hole codebase
  async createUser(user) {
    const hashedPassword = await this.hashPassword(user.password, user.name);
    const newUser = { ...user, password: hashedPassword, id: uuidv4() };
    return new User(await this.userRepository.create(newUser)).sanitize();
  }

  /* Alexander von Truchseß 27.11.2024 Removed update and delete function because every user could this, which makes not that much seens to have the permission to delete other users
  async updateUser(id, user) {
    const hashedPassword = await this.hashPassword(user.password, user.name);
    const updatedUser = { ...user, password: hashedPassword };
    return new User(await this.userRepository.update(id, user)).sanitize();
  }

  //Could add a isActive flag, to enable soft-delete but databases solutions like SQL Temporal Table could also be used
  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }
*/

  async hashPassword(password, name) {
    const salt = name + process.env.PASSWORT_SALT; //Some random information for the salt would also be good, but PASSWORT_SALT + name should be strong
    const hash = await crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512") // Hash the password with the salt
      .toString("hex");

    return hash;
  }
}

module.exports = UserService;

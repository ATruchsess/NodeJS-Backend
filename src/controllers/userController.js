// Alexander von Truchseß 26.11.2024
// A controller layer for the seperation of concerns

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async login(req, res) {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const { token, user } = await this.userService.authenticateUser(
        name,
        password
      );

      // Set the token as an HTTP-only cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 3600000 * 24, // 24 hours
      });

      res
        .status(200)
        .json({
          message: "Login successful",
          user: { id: user.id, name: user.name },
        });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production, Ensure this matches your cookie's configuration
      sameSite: "strict",
    });
    res.status(200).send({ message: "Logged out successfully" });
  }

  async getUsers(req, res) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id; // Assuming `req.user` is populated by `authorization` middleware
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;

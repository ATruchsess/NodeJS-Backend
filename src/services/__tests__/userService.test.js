/* Alexander von Truchseß 26.11.2024
 Some testing, for the user service functions.
*/

const UserService = require("../userService");
const User = require("../../models/user");

describe("UserService", () => {
  let userRepositoryMock;
  let userService;

  beforeEach(() => {
    // Mock the user repository
    userRepositoryMock = {
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementFailLoginCount: jest.fn(),
      resetFailLoginCount: jest.fn(),
    };

    // Set up environment variables
    process.env.JWT_SECRET = "testsecret";
    process.env.MAX_FAILED_LOGIN_ATTEMPTS = 3;
    process.env.PASSWORT_SALT = "df9dkd2daij2343309474ea";
    process.env.JWT_EXPIRES_TIME_HOURS = "24";

    // Initialize the UserService
    userService = new UserService(userRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateUser", () => {   
    it("should throw an error if user is not found", async () => {
      userRepositoryMock.findByUsername.mockResolvedValue(null);

      await expect(userService.authenticateUser("JohnDoe", "password")).rejects.toThrow();
    });

    it("should throw an error if the account is locked", async () => {
      const mockUser = { id: "123", name: "JohnDoe", password: "hashedpass", failLoginCount: 3 };
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);

      await expect(userService.authenticateUser("JohnDoe", "password")).rejects.toThrow();
    });

    it("should authenticate the user successfully if failLoginCount is below the limit", async () => {
      let mockUser = { id: "123", name: "JohnDoe", password: "hashedpass", failLoginCount: 1 };
      mockUser.password = await userService.hashPassword(mockUser.password, mockUser.name);
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);
      
      // Call the function
      let result = await userService.authenticateUser("JohnDoe", "hashedpass");      
      let compare = new User(mockUser).sanitize();

      expect(userRepositoryMock.resetFailLoginCount).toHaveBeenCalledWith("123");

      // Assertions
      expect(excludeFields(result.user, ["creationDate"])).toEqual(excludeFields(compare, ["creationDate"]));
    });
  
    it("should increment failLoginCount on incorrect password", async () => {
      const mockUser = { id: "123", name: "JohnDoe", password: "hashedpass", failLoginCount: 1 };
      userRepositoryMock.findByUsername.mockResolvedValue(mockUser);

      await expect(userService.authenticateUser("JohnDoe", "wrongPassword")).rejects.toThrow();

      expect(userRepositoryMock.incrementFailLoginCount).toHaveBeenCalledWith("123");
    });
  });

  describe("getUsers", () => {
    it("should return all users with sanitized data", async () => {
      const mockUsers = [
        { id: "123", name: "JohnDoe", password: "hashedpass" },
        { id: "456", name: "JaneDoe", password: "hashedpass" },
      ];
      userRepositoryMock.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(userRepositoryMock.findAll).toHaveBeenCalled();
      expect(result.map((user) => excludeFields(user, ["creationDate"]))).toEqual(
        mockUsers.map((user) => excludeFields(new User(user).sanitize(), ["creationDate"]))
      );
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const mockUser = { id: "123", name: "JohnDoe", password: "hashedpass" };
      userRepositoryMock.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById("123");

      expect(userRepositoryMock.findById).toHaveBeenCalledWith("123");
      expect(excludeFields(result, ["creationDate"])).toEqual(
        excludeFields(new User(mockUser).sanitize(), ["creationDate"])
      );
    });

    it("should throw an error if the user is not found", async () => {
      userRepositoryMock.findById.mockResolvedValue(null);

      await expect(userService.getUserById("123")).rejects.toThrow("User not found");
    });
  });

  function excludeFields(obj, fieldsToExclude) {
    const filtered = { ...obj };
    fieldsToExclude.forEach((field) => delete filtered[field]);
    return filtered;
  }
});

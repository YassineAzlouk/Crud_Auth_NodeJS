const UserService = require('../services/userService');

const UserController = {
  changePassword: async (req, res) => {
    const { login, oldPassword, newPassword } = req.body;

    try {
      const result = await UserService.changePassword(login, oldPassword, newPassword);
      res.json({ message: result });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
};

module.exports = UserController;

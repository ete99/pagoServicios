const UserService = require('../services/userService');

class UserController {
  static async register(req, res, next) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await UserService.login(email, password);
      res.json({ message: 'Inicio de sesión exitoso', user, token });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserService.getProfile(req.user.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

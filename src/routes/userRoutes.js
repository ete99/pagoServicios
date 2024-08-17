const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const { userValidationRules } = require("../middlewares/validationRules");
const validate = require("../middlewares/validate");
const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - documentNumber
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               documentNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post(
  "/register",
  userValidationRules.register,
  validate,
  UserController.register
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  "/login",
  userValidationRules.login,
  validate,
  UserController.login
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario obtenido exitosamente
 *       401:
 *         description: No autorizado
 */
router.get("/profile", authMiddleware, UserController.getProfile);

module.exports = router;

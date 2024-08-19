const express = require("express");
const PaymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/auth");
const { paymentValidationRules } = require("../middlewares/validationRules");
const validate = require("../middlewares/validate");
const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/payments/process:
 *   post:
 *     summary: Procesa un pago
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *               - serviceCode
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               serviceCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pago procesado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/process",
  paymentValidationRules.processPayment,
  validate,
  PaymentController.processPayment
);

/**
 * @swagger
 * /api/payments/history/{userId}:
 *   get:
 *     summary: Obtiene el historial de pagos de un usuario
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Historial de pagos obtenido exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Historial de pagos no encontrado
 */
router.get(
  "/history/:userId",
  paymentValidationRules.getPaymentHistory,
  validate,
  PaymentController.getPaymentHistory
);

/**
 * @swagger
 * /api/payments/history/{userId}/service/{serviceCode}:
 *   get:
 *     summary: Obtiene los pagos de un usuario por código de servicio
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del usuario
 *       - in: path
 *         name: serviceCode
 *         schema:
 *           type: string
 *         required: true
 *         description: El código del servicio
 *     responses:
 *       200:
 *         description: Pagos obtenidos exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.get(
  "/history/:userId/service/:serviceCode",
  paymentValidationRules.getPaymentsByService,
  validate,
  PaymentController.getPaymentsByService
);

module.exports = router;

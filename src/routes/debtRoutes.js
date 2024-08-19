const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { debtValidationRules } = require("../middlewares/validationRules");
const validate = require("../middlewares/validate");
const DebtController = require("../controllers/debtController");
const router = express.Router();

router.use(authMiddleware);
/**
 * @swagger
 * /api/debts/{referenceNumber}/{serviceCode}:
 *   get:
 *     summary: Obtiene la deuda de un usuario por el número de referencia y el código de servicio
 *     tags: [Debts]
 *     parameters:
 *       - in: path
 *         name: referenceNumber
 *         schema:
 *           type: string
 *         required: true
 *         description: El número de referencia del usuario
 *       - in: path
 *         name: serviceCode
 *         schema:
 *           type: string
 *         required: true
 *         description: El código del servicio
 *     responses:
 *       200:
 *         description: Deuda obtenida exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.get(
  "/:referenceNumber/:serviceCode",
  debtValidationRules.getDebt,
  validate,
  DebtController.getDebtByServiceCode
);

module.exports = router;

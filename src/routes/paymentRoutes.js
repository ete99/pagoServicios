const express = require("express");
const PaymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/auth");
const { paymentValidationRules } = require("../middlewares/validationRules");
const validate = require("../middlewares/validate");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/process",
  paymentValidationRules.processPayment,
  validate,
  PaymentController.processPayment
);
router.get(
  "/history/:userId",
  paymentValidationRules.getPaymentHistory,
  validate,
  PaymentController.getPaymentHistory
);
router.get(
  "/byService/:userId/:serviceCode",
  paymentValidationRules.getPaymentsByService,
  validate,
  PaymentController.getPaymentsByService
);

module.exports = router;

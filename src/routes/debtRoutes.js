const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { debtValidationRules } = require("../middlewares/validationRules");
const validate = require("../middlewares/validate");
const DebtController = require("../controllers/debtController");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/debt/:referenceNumber/:serviceCode",
  debtValidationRules.getDebt,
  validate,
  DebtController.getDebtByServiceCode
);

module.exports = router;

const { body, param, query } = require("express-validator");

const userValidationRules = {
  register: [
    body("email").isEmail().withMessage("Email inválido"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("documentNumber")
      .notEmpty()
      .withMessage("El número de documento es requerido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  login: [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
};

const paymentValidationRules = {
  processPayment: [
    body("userId").isInt().withMessage("UserId debe ser un número entero"),
    body("debtId").isInt().withMessage("DebtId debe ser un número entero"),

    body("amountPaid")
      .isFloat({ min: 0 })
      .withMessage("El monto pagado debe ser un número positivo"),
  ],
  getPaymentHistory: [
    param("userId").isInt().withMessage("UserId debe ser un número entero"),
    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("La fecha de inicio debe ser una fecha válida"),
    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("La fecha de fin debe ser una fecha válida"),
  ],
  getPaymentsByService: [
    param("userId").isInt().withMessage("UserId debe ser un número entero"),
    param("serviceCode")
      .notEmpty()
      .withMessage("El código de servicio es requerido"),
  ],
};

const debtValidationRules = {
  getDebt: [
    param("referenceNumber")
      .notEmpty()
      .withMessage("El número de referencia es requerido"),
    param("serviceCode").notEmpty().withMessage("El código de servicio"),
  ],
};

module.exports = {
  userValidationRules,
  paymentValidationRules,
  debtValidationRules,
};

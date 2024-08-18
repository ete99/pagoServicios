const PaymentService = require("../services/paymentService");

class PaymentController {
  static async processPayment(req, res, next) {
    try {
      const { userId, amountPaid, debtId } = req.body;
      const payment = await PaymentService.processPayment(
        userId,
        amountPaid,
        debtId
      );
      res.status(201).json({ message: "Pago procesado exitosamente", payment });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentHistory(req, res, next) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query;

      const payments = await PaymentService.getPaymentHistory(
        userId,
        startDate,
        endDate
      );
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentsByService(req, res, next) {
    try {
      const { userId, serviceCode } = req.params;
      const payments = await PaymentService.getPaymentsByService(
        userId,
        serviceCode
      );
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;

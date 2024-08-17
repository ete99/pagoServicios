const Payment = require("../models/Payment");

class PaymentService {
  static async processPayment(userId, amountPaid, debtId) {
    // Procesar el pago
    const payment = await Payment.create({
      userId,
      debtId,
      amountPaid,
    });

    // *Los balances y chequeos se verifican automaticamente con triggers en la base de datos

    return payment;
  }

  static async getPaymentHistory(userId, startDate, endDate) {
    return Payment.findByDateRange(userId, startDate, endDate);
  }

  static async getPaymentsByService(userId, serviceCode) {
    return Payment.findByService(userId, serviceCode);
  }
}

module.exports = PaymentService;

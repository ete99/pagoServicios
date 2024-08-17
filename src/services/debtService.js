const Debt = require("../models/Debt");

class DebtService {
  static async getDebt(referenceNumber, serviceCode) {
    return Debt.findByServiceCode(referenceNumber, serviceCode);
  }
}

module.exports = DebtService;

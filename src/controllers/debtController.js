const DebtService = require("../services/debtService");

class DebtController {
  static async getDebtByServiceCode(req, res, next) {
    try {
      const { referenceNumber, serviceCode } = req.params;
      const debt = await DebtService.getDebt(referenceNumber, serviceCode);
      res.json(debt);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DebtController;

const ServiceSearchService = require("../services/serviceSearchService");

class ServiceSearchController {
  static async searchServices(req, res, next) {
    try {
      const { term } = req.query;
      const services = await ServiceSearchService.searchServices(term);
      res.json(services);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiceSearchController;

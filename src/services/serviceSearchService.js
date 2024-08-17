const Service = require('../models/Service');

class ServiceSearchService {
  static async searchServices(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return Service.findAll();
    }
    return Service.search(searchTerm);
  }
}

module.exports = ServiceSearchService;

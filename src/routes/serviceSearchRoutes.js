const express = require("express");
const ServiceSearchController = require("../controllers/serviceSearchController");
const validate = require("../middlewares/validate");
// const authMiddleware = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * /api/services/search:
 *   get:
 *     summary: Search services
 *     tags: [Services]
 *     description: Retrieve a list of services based on the search term
 *     parameters:
 *       - in: query
 *         name: term
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: A list of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Internal server error
 */
router.get("/search", validate, ServiceSearchController.searchServices);

module.exports = router;

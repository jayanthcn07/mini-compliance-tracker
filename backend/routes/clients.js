const router = require("express").Router();
const Client = require("../models/Client");

// GET all clients
router.get("/", async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ company_name: 1 });
    res.json(clients);
  } catch (err) {
    next(err);
  }
});

// POST create client
router.post("/", async (req, res, next) => {
  try {
    const { company_name, country, entity_type } = req.body;
    if (!company_name || !country) {
      return res.status(400).json({ error: "company_name and country are required" });
    }
    const client = await Client.create({ company_name, country, entity_type });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
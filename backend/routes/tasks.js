const router = require("express").Router();
const Task = require("../models/Task");
const mongoose = require("mongoose");

// GET tasks for a client — supports ?status=&category=
router.get("/:clientId", async (req, res, next) => {
  try {
    const { clientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clientId))
      return res.status(400).json({ error: "Invalid client ID" });

    const filter = { client_id: clientId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const tasks = await Task.find(filter).sort({ due_date: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST create task
router.post("/", async (req, res, next) => {
  try {
    const { client_id, title, due_date } = req.body;
    if (!client_id || !title || !due_date)
      return res.status(400).json({ error: "client_id, title, and due_date are required" });

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PATCH update task status
router.patch("/:taskId/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "In Progress", "Completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ error: "Invalid status value" });

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
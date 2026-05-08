const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// =======================
// CREATE TASK
// =======================
router.post("/", auth, async (req, res) => {
  try {
    if (!req.body.title || req.body.title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({
      title: req.body.title,
      user: req.user.id,
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// GET USER TASKS
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// UPDATE TASK (OWNERSHIP CHECK)
// =======================
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// DELETE TASK (OWNERSHIP CHECK)
// =======================
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Task not found or not authorized" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// =======================
// GET ALL TASKS
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =======================
// CREATE TASK
// =======================
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;

    // VALIDATION
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    // CREATE TASK
    const newTask = new Task({
      title: title.trim(),
      completed: false,
      user: req.user.id,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =======================
// UPDATE TASK
// =======================
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // SECURITY
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // UPDATE TITLE
    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }

    // UPDATE COMPLETED
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
    }

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =======================
// DELETE TASK
// =======================
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // SECURITY
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
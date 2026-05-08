const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// ======================
// GET TASKS
// ======================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    });

    res.json(tasks);
  } catch (err) {
    console.log("GET TASKS ERROR:", err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// CREATE TASK
// ======================
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title required",
      });
    }

    const newTask = new Task({
      title,
      description,
      user: req.user.id,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (err) {
    console.log("CREATE TASK ERROR:", err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// UPDATE TASK
// ======================
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    task.title = req.body.title || task.title;
    task.description =
      req.body.description || task.description;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    console.log("UPDATE TASK ERROR:", err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ======================
// DELETE TASK
// ======================
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    console.log("DELETE TASK ERROR:", err.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
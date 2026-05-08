const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

router.post("/suggest", auth, async (req, res) => {
  try {
    // simple AI-like suggestions
    const tasks = [
      "Study for 1 hour",
      "Complete one pending task",
      "Take a short break",
      "Revise what you learned",
      "Plan for tomorrow"
    ];

    const savedTasks = await Promise.all(
      tasks.map((task) =>
        Task.create({
          title: task,
          user: req.user.id   // ✅ FIXED HERE
        })
      )
    );

    res.json({
      success: true,
      tasks: savedTasks
    });

  } catch (err) {
    console.error("AI Suggest Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
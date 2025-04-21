const express = require("express");
const router = express.Router();
const weekController = require("../controllers/weekController");
const { authMiddleware } = require("../middleware/auth");

router.get("/current", authMiddleware, weekController.getCurrentWeek);

// create a new week
router.post("/", authMiddleware, weekController.createWeek);

router.get("/", authMiddleware, weekController.getAllWeeksForUser);

router.get("/:id", authMiddleware, weekController.getWeekById);

router.patch("/:id", authMiddleware, weekController.updateWeek);

router.delete("/:id", authMiddleware, weekController.deleteWeek);

router.get("/:id/review", authMiddleware, weekController.getWeeklyReview);

module.exports = router;

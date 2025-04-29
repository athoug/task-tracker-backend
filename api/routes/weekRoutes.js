const express = require("express");
const router = express.Router();
const weekController = require("../controllers/weekController");
const { authMiddleware } = require("../middleware/auth");

router.get("/current", authMiddleware, weekController.getCurrentWeek);

router.get("/archived", authMiddleware, weekController.getArchivedWeeks);

router.post("/archive", authMiddleware, weekController.archiveFinishedWeek);

// create a new week
router.post("/", authMiddleware, weekController.createWeek);

router.get("/", authMiddleware, weekController.getAllWeeksForUser);

router.get("/:id/review", authMiddleware, weekController.getWeeklyReview);

router.get("/:id", authMiddleware, weekController.getWeekById);

router.patch("/:id", authMiddleware, weekController.updateWeek);

router.delete("/:id", authMiddleware, weekController.deleteWeek);

module.exports = router;

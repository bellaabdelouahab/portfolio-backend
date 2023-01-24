const express = require("express");
const router = express.Router();

const portfolioController = require("../controllers/portfolioController");
const authController = require("./../controllers/authController");



router.get("/projects",portfolioController.getAllProjects)
router.get("/projects/:id",portfolioController.getProject)

router.get("/skills",portfolioController.getAllSkills)
router.get("/skills/:id",portfolioController.getSkill)

router.get("/reports",portfolioController.getAllReports)
router.get("/reports/:id",portfolioController.getReport)

router.use(authController.protect);

router.use(authController.restrictTo("admin"));

router.post("/projects",portfolioController.createProject)
router.patch("/projects/:id",portfolioController.updateProject)

router.post("/skills",portfolioController.createSkill)
router.patch("/skills/:id",portfolioController.updateSkill)

router.post("/reports",portfolioController.createReport)
router.patch("/reports/:id",portfolioController.updateReport)

module.exports = router;


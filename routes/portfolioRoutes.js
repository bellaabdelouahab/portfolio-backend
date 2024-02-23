const express = require("express");
const router = express.Router();

const portfolioController = require("../controllers/portfolioController");
const authController = require("./../controllers/authController");



router.get("/projects",portfolioController.getAllProjects)
router.get("/projects/getoverview", portfolioController.getOverview)
router.get("/projects/:id",portfolioController.getProject)

router.get("/skills",portfolioController.getAllSkills)
router.get("/skills/:id",portfolioController.getSkill)

router.get("/reports",portfolioController.getAllReports)
router.get("/reports/:id",portfolioController.getReport)

router.get("/certificates",portfolioController.getAllCertificates)
router.get("/certificates/count",portfolioController.countCertificates)
// count certificates

router.get("/clients",portfolioController.getAllClients)
router.get("/clients/:id",portfolioController.getClient)

router.use(authController.protect);
router.post("/projects",portfolioController.createProject)
router.post("/certificates",portfolioController.createCertificate)
router.post("/reports",portfolioController.createReport)
// clients
router.post("/clients",portfolioController.createClient)


router.use(authController.restrictTo("admin"));

router.patch("/projects/:id",portfolioController.updateProject)
router.put("/projects/overview",portfolioController.updateOverview)

router.post("/skills",portfolioController.createSkill)
router.patch("/skills/:id",portfolioController.updateSkill)

router.patch("/reports/:id",portfolioController.updateReport)

module.exports = router;


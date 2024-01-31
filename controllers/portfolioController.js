const Project = require("../models/portfolio/projectModel");
const Certificate = require("../models/portfolio/certificateModel");
const Skill = require("../models/portfolio/skillModel");
const Report = require("../models/portfolio/reportModel");
const base = require('./baseController');

exports.getAllProjects = base.getAll(Project);
exports.getProject = base.getOne(Project);
exports.createProject = base.createOne(Project);
exports.updateProject = base.updateOne(Project);
exports.deleteProject = base.deleteOne(Project);
// show in overview
exports.updateOverview = async (req, res, next) => {
    // from db get all projects with showInOverview = true and set them to false
    // and then get from req.body the projects ids and set the overview of those projects to true
    try {
        await Project.updateMany({ showInOverview: true }, { showInOverview: false });
        const projectIds = req.body.projectIds;
        await Project.updateMany({ _id: { $in: projectIds } }, { showInOverview: true });
        res.status(200).json({
            status: "success",
            message: "Overview updated successfully"
        });
    } catch (error) {
        next(error);
    }
}
// get all projects with showInOverview = true
exports.getOverview = async (req, res, next) => {
    try {
        const projects = await Project.find({ showInOverview: true });
        res.status(200).json({
            status: "success",
            data: projects
        });
    } catch (error) {
        next(error);
    }
}


exports.getAllCertificates = base.getAll(Certificate);
exports.getCertificate = base.getOne(Certificate);
exports.createCertificate = base.createOne(Certificate);
exports.updateCertificate = base.updateOne(Certificate);
exports.deleteCertificate = base.deleteOne(Certificate);


exports.getAllSkills = base.getAll(Skill);
exports.getSkill = base.getOne(Skill);
exports.createSkill = base.createOne(Skill);
exports.updateSkill = base.updateOne(Skill);
exports.deleteSkill = base.deleteOne(Skill);

exports.getAllReports = base.getAll(Report);
exports.getReport = base.getOne(Report);
exports.createReport = base.createOne(Report);
exports.updateReport = base.updateOne(Report);
exports.deleteReport = base.deleteOne(Report);


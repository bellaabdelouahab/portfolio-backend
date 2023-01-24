const Project = require("../models/portfolio/projectModel");
const Skill = require("../models/portfolio/skillModel");
const Report = require("../models/portfolio/reportModel");
const base = require('./baseController');

exports.getAllProjects = base.getAll(Project);
exports.getProject = base.getOne(Project);
exports.createProject = base.createOne(Project);
exports.updateProject = base.updateOne(Project);

exports.getAllSkills = base.getAll(Skill);
exports.getSkill = base.getOne(Skill);
exports.createSkill = base.createOne(Skill);
exports.updateSkill = base.updateOne(Skill);

exports.getAllReports = base.getAll(Report);
exports.getReport = base.getOne(Report);
exports.createReport = base.createOne(Report);
exports.updateReport = base.updateOne(Report);


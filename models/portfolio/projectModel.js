const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    githubLink: {
      type: String,
      required: true,
    },
    tools: {
      techs: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
      }],
      resources: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
      }],
    },
    codeSamples: [{
      title: { type: String, required: true },
      code: { type: String, required: true },
      language: { type: String },
    }],
    carouselImages: [{
      img: { type: String, required: true },
      title: { type: String, required: true },
    }],
    highlighted: {
      type: String,
      enum: ["star", "basic"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    durration: {
      type: String,
    },
    showInOverview: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String]
    },
    dataSources: [{
      type: {
        type: String,
        required: true,
        enum: ["excel", "csv", "json", "sql-server", "mysql", "mongodb", "python", "xml"],
      },
      name: { type: String, required: true },
      size: { type: String, required: true },
      link: { type: String },
    }],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.pre("save", async function (next) {
  // save project image to public folder
  const project = this;
  try {
    if (!project.isModified("image")) {
      return next();
    }
    const date = new Date();
    // if dir images/projects does not exist, create it
    if (!fs.existsSync("public/images/projects")) {
      fs.mkdirSync("public/images/projects");
    }
    const mainPath = path.join("public", "images", "projects", project._id + "");
    // create folder with _id as a name in mainPath
    if (!fs.existsSync(mainPath)) {
      fs.mkdirSync(mainPath);
    }
    // save main image
    const imageType = project.image.split(";")[0].split("/")[1];
    const mainImagePath = path.join(mainPath, `${date.getTime()}.${imageType}`);
    const imageBuffer = new Buffer.from(
      project.image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    fs.writeFileSync(mainImagePath, imageBuffer);

    // create carousel folder
    const carouselDir = path.join(mainPath, "carousel");
    if (!fs.existsSync(carouselDir)) {
      fs.mkdirSync(carouselDir);
    }
    // loop on carousel images and save them
    project.carouselImages.forEach((element, index) => {
      const image = element.img
      const imageType = image.split(";")[0].split("/")[1];
      const filepath = path.join(
        carouselDir,
        `${date.getTime()}-${index}.${imageType}`
      );
      const imageBuffer = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      fs.writeFileSync(filepath, imageBuffer);
      project.carouselImages[index].img = filepath.replaceAll("\\", "/").replace("public", "");
    });
    project.image = mainImagePath.replaceAll("\\", "/").replace("public", "");


    // set start and end date to YYYY-MM-DD format
    project.startDate = new Date(project.startDate);
    project.startDate = project.startDate.toISOString().split("T")[0];
    if (project.endDate) {
      project.endDate = new Date(project.endDate);
      project.endDate = project.endDate.toISOString().split("T")[0];
    }

    // calcluate durration
    const startDate = new Date(project.startDate);
    if (!project.endDate) {
      project.durration = "ongoing";
      next();
      return
    }
    else {
      const endDate = new Date(project.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      project.durration = diffDays + " days";
      next();
      return;
    }
  } catch (error) {
    // handle error
    console.error(error);
    // delete the document
    await project.remove();
    next(error);
  }
});

// when deleting project, delete its images from public folder
ProjectSchema.pre("remove", async function (next) {
  const project = this;
  try {
    const mainPath = path.join("public", "images", "projects", project._id + "");
    if (fs.existsSync(mainPath)) {
      fs.rmdirSync(mainPath, { recursive: true });
    }
    next();
  } catch (error) {
    next(error);
  }
}
);




// load project image from public folder when getting project


const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;


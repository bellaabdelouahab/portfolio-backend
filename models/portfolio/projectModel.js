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
    codeSamples: [{ 
      title: { type: String, required: true },
      code: { type: String, required: true },
    }],
    carouselImages: [{ 
      img: { type: String, required: true },
      title: { type: String, required: true },
      // description: { type: String, required: true },
    }],
    highlighted: {
      type: String,
      enum: ["star", "basic"],
    }
  },
  {
    timestamps: true,
  }
);

ProjectSchema.pre("save", async function (next) {
  // save project image to public folder
  const project = this;
  if (!project.isModified("image")) {
    return next();
  }
  const date = new Date();
  const mainPath = path.join("public","images", project._id+"");
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
    project.carouselImages[index].img = filepath;
  });
  project.image = mainImagePath.replaceAll("\\", "/").replace("public", "");

  next();
});

// load project image from public folder when getting project


const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;


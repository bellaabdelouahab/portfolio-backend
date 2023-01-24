const mongoose = require("mongoose");
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
    codeSamples: [{ type: String }],
    carouselImages: [{ type: Buffer }],
  },
  {
    timestamps: true,
  }
);



const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;

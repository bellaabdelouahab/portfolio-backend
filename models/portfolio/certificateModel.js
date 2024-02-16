const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = mongoose.Schema;

const CertificateModel = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    downloadPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

CertificateModel.pre("save", async function (next) {
  // save certificate image to certificates in public folder
  const certificate = this;
  if (!certificate.isModified("image")) {
    return next();
  }
  const mainPath = path.join("public", "images", "certificates");
  // create folder with _id as a name in mainPath
  if (!fs.existsSync(mainPath)) {
    fs.mkdirSync(mainPath);
  }
  // save main image
  const imageType = certificate.image.split(";")[0].split("/")[1];
  const mainImagePath = path.join(mainPath, `${certificate._id}.${imageType}`);
  const imageBuffer = new Buffer.from(
    certificate.image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  fs.writeFileSync(mainImagePath, imageBuffer);
  certificate.image = mainImagePath.replaceAll("\\", "/").replace("public", "");
  next();
});

CertificateModel.pre("remove", async function (next) {
    const certificate = this;
    const mainPath = path.join("public", "images", "certificates");
    const imageType = certificate.image.split(";")[0].split("/")[1];
    const mainImagePath = path.join(mainPath, `${certificate._id}.${imageType}`);
    fs.unlinkSync(mainImagePath);
    next();
    });

const Certificate = mongoose.model("Certificate", CertificateModel);

module.exports = Certificate;
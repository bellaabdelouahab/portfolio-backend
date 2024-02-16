// name image description profession and company 

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Schema } = mongoose;

const ClientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        profession: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


ClientSchema.pre("save", function (next) {
    // save client image to public folder in clients folder
    const client = this;
    
    if (!client.isModified("image")) {
        return next();
    }
    const imgPath = path.join("public", "images", "clients");
    // create folder with _id as a name in imgPath
    if (!fs.existsSync(imgPath)) {
        fs.mkdirSync(imgPath);
    }
    // save main image
    const imageType = client.image.split(";")[0].split("/")[1];
    const mainImagePath = path.join(imgPath, `${client._id}.${imageType}`);
    const imageBuffer = new Buffer.from(
        client.image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    );
    fs.writeFileSync(mainImagePath, imageBuffer);
    client.image = mainImagePath.replaceAll("\\", "/").replace("public", "");
    next();
    

});

ClientSchema.pre("remove", function (next) {
    const client = this;
    const imgPath = path.join("public", "images", "clients");
    const imageType = client.image.split(";")[0].split("/")[1];
    fs.unlinkSync(path.join(imgPath, `${client._id}.${imageType}`));
    next();
});

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;



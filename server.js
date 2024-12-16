const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: fs.existsSync(path.join(__dirname, ".env.production"))
    ? ".env.production"
    : ".env",
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

const app = require("./app");

const database = process.env.DATABASE.replace(
  "<db_password>", 
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", true);

// Connect the database
mongoose
  .connect(database, { useNewUrlParser: true })
  .then((con) => {
    console.log("DB connection Successfully!");

    // Start the server
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(
        "\x1b[30m",
        "Application is running on  ",
        "\x1b[32m",
        `http://localhost:${port}/api`,
        "\x1b[0m",
        ""
      );
    });
  })
  .catch((err) => {
    console.log("DB connection failed!");
    console.log(err.name, err.message);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});



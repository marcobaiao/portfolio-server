const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = require("./index");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((conn) => {
  console.log("DB connection successful: ");
});

const port = process.env.PORT || 3002;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

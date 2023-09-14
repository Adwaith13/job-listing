const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "all good" });
});

app.listen(process.env.PORT, (req, res) => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(  `Server up and running on http://localhost:${process.env.PORT}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

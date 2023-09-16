const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors=require("cors")
const authRoutes=require("../server/routes/auth.js")

dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", service: "job listing platform",timestamp:new Date()});
});

app.use("/auth",authRoutes)

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Server up and running on http://localhost:${process.env.PORT}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

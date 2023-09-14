const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const User = mongoose.model("User", {
  name: String,
  email: String,
  mobile: Number,
  password: String,
});

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "all good" });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      mobile,
      password: encryptedPassword,
    };

    await User.create(newUser);
    res.json({
      status: "success",
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(500).json({
        status: "failed",
        message: "user not found",
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      res.status(500).json({
        status: "failed",
        message: "user not found",
      });
    }
    res.json({
      status: "SUCCESS",
      message: `${user.name} signed in successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

app.listen(process.env.PORT, (req, res) => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Server up and running on http://localhost:${process.env.PORT}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

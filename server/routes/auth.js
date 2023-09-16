const express = require("express");
const router = express.Router();
const users = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isUserRegistered = (req, res, next) => {
  try {
    const token = req.headers.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "failed",
      message: "User Unauthorized",
    });
  }
};

const isUserLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      status: "failed",
      message: "User Unauthorized",
    });
  }
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      res.status(400).json({
        status: "failed",
        message: "please input values",
      });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        status: "failed",
        message: "user already exists",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      mobile,
      password: encryptedPassword,
    };

    await users.create(newUser);
    const token = jwt.sign(newUser, process.env.JWT_SECRET, { expiresIn: 60 });

    res.json({
      status: "success",
      message: "user created successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});

router.post("/login", isUserRegistered, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      res.status(404).json({ status: "failed", message: "user not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res
        .status(404)
        .json({ status: "failed", message: "invalid credentials" });
    }
    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60,
    });

    res.status(200).json({
      status: "success",
      message: `${user.name} loggedIn successfully`,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "failed", message: "something wrong" });
  }
});

router.get("/dashboard", isUserLoggedIn, (req, res) => {
  res.send(`Welcome user ${req.user.name}`);
});

module.exports = router;

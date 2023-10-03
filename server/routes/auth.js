const express = require("express");
const router = express.Router();
const users = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register new users
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

//user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      res.status(400).json({ status: "failed", message: "Email and Password Required"});
    }
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
    const loginToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET,{expiresIn:14400});

    res.status(200).json({
      status: "success",
      message: `${user.name}`,
      loginToken,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "failed", message: "something wrong" });
  }
});

module.exports = router;

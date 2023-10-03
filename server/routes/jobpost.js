const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../models/users.js");
const jobPost = require("../models/jobs.js");

//middleware to check if user is logged in
const isUserLoggedIn = (req, res, next) => {
  try {
    const loginToken = req.headers.token;
    const user = jwt.verify(loginToken, process.env.JWT_SECRET);
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

//post new job details
router.post("/jobpost", isUserLoggedIn, async (req, res) => {
  try {
    const newJobPost = new jobPost({ ...req.body });

    const required_fields = [
      "company_name",
      "add_logo_url",
      "job_position",
      "monthly_salary",
      "job_type",
      "remote_office",
      "location",
      "job_description",
      "about_company",
      "skills_required",
      "information",
    ];

    for (const field of required_fields) {
      if (!req.body[field]) {
        res.status(400).json({
          status: "failed",
          message: `${field} is required`,
        });
      }
    }
    await jobPost.create(newJobPost);

    res.json({
      status: "SUCCESS",
      message: "Job Posted successfully",
    });
  } catch {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});


//update the job details using ID
router.patch("/jobpost/:id",isUserLoggedIn, async (req, res) => {
  try {
    const {
      company_name,
      add_logo_url,
      job_position,
      monthly_salary,
      job_type,
      remote_office,
      location,
      job_description,
      about_company,
      skills_required,
      information,
    } = req.body;
    const { id } = req.params;
    await jobPost.findByIdAndUpdate(id, {
      company_name,
      add_logo_url,
      job_position,
      monthly_salary,
      job_type,
      remote_office,
      location,
      job_description,
      about_company,
      skills_required,
      information,
    });
    res.json({
      status: "SUCCESS",
      message: "Job Details updated successfully",
    });
  } catch {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

router.get("/jobdata",async(req,res)=>{
    try{
        const jobs=await jobPost.find();
        res.json({
            status:'success',
            jobdata:jobs,
        })
    }
    catch{
        res.status(500).json({
            status: 'FAILED',
            message: 'Something went wrong'
          })
    }
})

//name of recruiter
router.get("/dashboard",isUserLoggedIn, (req, res) => {
    res.send(`Hello! ${req.user.name}`);
  });

module.exports = router;

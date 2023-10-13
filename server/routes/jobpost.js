const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

//name of recruiter
router.get("job-listing-ecru.vercel.app/dashboard", isUserLoggedIn, (req, res) => {
  res.send(`Hello! ${req.user.name}`);
});

//post new job details
router.post("job-listing-ecru.vercel.app/jobpost", async (req, res) => {
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
        return res.status(400).json({
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
router.patch("job-listing-ecru.vercel.app/jobpost/:id", async (req, res) => {
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


//fetch data for edit forms using id
router.get("job-listing-ecru.vercel.app/jobpost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobDatabyID = await jobPost.findById(id, {
      company_name: 1,
      add_logo_url: 1,
      job_position: 1,
      monthly_salary: 1,
      job_type: 1,
      remote_office: 1,
      location: 1,
      job_description: 1,
      about_company: 1,
      skills_required: 1,
      information: 1,
    });

    if (!jobDatabyID) {
      return res.status(404).json({
        status: "FAILED",
        message: "Job not found",
      });
    }

    res.json({
      status: "SUCCESS",
      message: jobDatabyID,
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

//fetching all jobdata
router.get("job-listing-ecru.vercel.app/jobdata", async (req, res) => {
  try {
    const jobs = await jobPost.find();
    res.json({
      status: "success",
      jobdata: jobs,
    });
  } catch {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

//fetching jobdata by id
router.get("job-listing-ecru.vercel.app/jobdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const jobDatabyID = await jobPost.findById(id, {
      company_name: 1,
      add_logo_url: 1,
      job_position: 1,
      monthly_salary: 1,
      job_type: 1,
      remote_office: 1,
      location: 1,
      job_description: 1,
      about_company: 1,
      skills_required: 1,
      information: 1,
    });

    if (!jobDatabyID) {
      return res.status(404).json({
        status: "FAILED",
        message: "Job not found",
      });
    }

    res.json({
      status: "SUCCESS",
      message: jobDatabyID,
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      message: "Something went wrong",
    });
  }
});

//filter jobs based on skills
router.get("job-listing-ecru.vercel.app/jobdata/skills", async(req,res)=>{
  try{
    const {skills_required}=req.query;
    if(skills_required){
      const allSkills=skills_required.split(',').map(skill => skill.trim());
      const filteredJobs=await jobPost.find({
        skills_required: {$in : allSkills}
      });
      res.json(filteredJobs);
    }else{
      res.json([]);
    }
  }catch(error){
    console.log(error)
    res.status(500).json({
      status:'failed',
      message:'Internal Server Error'
    })

  }
})

//route for fetching jobposition
router.get("job-listing-ecru.vercel.app/jobdata/jobposition", async(req,res)=>{
  try{
    const {job_position}=req.query;
    if(job_position){
      const allPositions = job_position.split(',').map(position => position.trim());
      const filteredPosition=await jobPost.find({
        job_position: {$in : allPositions}
      });
      res.json(filteredPosition);
    }else{
      res.json([]);
    }
  }catch(error){
    console.log(error)
    res.status(500).json({
      status:'failed',
      message:'Internal Server Error'
    })
  }
})

module.exports = router;

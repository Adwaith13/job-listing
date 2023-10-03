const mongoose = require("mongoose");

const jobpostSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  add_logo_url: {
    type: String,
    required: true,
  },
  job_position: {
    type: String,
    required: true,
  },
  monthly_salary: {
    type: String,
    required: true,
  },
  job_type: {
    type: String,
    required: true,
  },
  remote_office: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  job_description: {
    type: String,
    required: true,
  },
  about_company: {
    type: String,
    required: true,
  },
  skills_required: {
    type: String,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("jobpost", jobpostSchema);

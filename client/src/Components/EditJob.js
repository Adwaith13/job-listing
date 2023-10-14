import React, { useState,useEffect } from "react";
import axios from "axios";
import "../style/JobPost.css";
import { useNavigate, useParams } from "react-router-dom";
import addjob from "../images/addjob.png";

export default function EditJob() {
  const { id } = useParams();
  const [jobPost, setjobPost] = useState({
    company_name: "",
    add_logo_url: "",
    job_position: "",
    monthly_salary: "",
    job_type: "",
    remote_office: "",
    location: "",
    job_description: "",
    about_company: "",
    skills_required: "",
    information: "",
  });

  useEffect(() => {
    axios
      .get(`https://job-listing-server.vercel.app/job/jobpost/${id}`)
      .then((res) => {
        console.log(res.data.message)
        setjobPost(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);


  const handleJobData = (e) => {
    e.preventDefault();
    axios
      .patch(`https://job-listing-server.vercel.app/job/jobpost/${id}`, jobPost)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err);
      });
    setjobPost({
      company_name: "",
      add_logo_url: "",
      job_position: "",
      monthly_salary: "",
      job_type: "",
      remote_office: "",
      location: "",
      job_description: "",
      about_company: "",
      skills_required: "",
      information: "",
    });
  };

  const navigate=useNavigate();

  const navigateHomePage=()=>{
    navigate("/");
  }
  return (
    <>
      <div className="addjob-container">
        <form className="jobpost-container" onSubmit={handleJobData}>
          <h1 className="add-job-heading">Edit Job description</h1>
          <label className="addjob-label">Company Name</label>
          <input
            className="company-name-input"
            placeholder="Enter your company name here"
            name="company_name"
            value={jobPost.company_name}
            onChange={(e) =>
              setjobPost({ ...jobPost, company_name: e.target.value })
            }
          ></input>
          <br></br>
          <label className="addjob-label">Add logo URL</label>
          <input
            className="add-logo-input"
            placeholder="Add the link"
            name="add_logo_url"
            value={jobPost.add_logo_url}
            onChange={(e) =>
              setjobPost({ ...jobPost, add_logo_url: e.target.value })
            }
          ></input>
          <br></br>
          <label className="addjob-label">Job Position</label>
          <input
            className="job-position-input"
            placeholder="Enter job position"
            name="job_position"
            value={jobPost.job_position}
            onChange={(e) => {
              setjobPost({ ...jobPost, job_position: e.target.value });
            }}
          ></input>
          <br></br>
          <label className="addjob-label">Monthly Salary</label>
          <input
            className="salary-input"
            placeholder="Enter amount in rupees"
            name="monthly_salary"
            value={jobPost.monthly_salary}
            onChange={(e) =>
              setjobPost({ ...jobPost, monthly_salary: e.target.value })
            }
          ></input>
          <br></br>
          <label className="addjob-label">Job Type</label>
          <select
            name="job_type"
            className="job-type-input"
            value={jobPost.job_type}
            onChange={(e) =>
              setjobPost({ ...jobPost, job_type: e.target.value })
            }
          >
            <option value="Full Time">Full Time</option>
            <option value="Part time">Part Time</option>
            <option value="Internship">Internship</option>
          </select>
          <br></br>
          <label className="addjob-label">Remote/Office</label>
          <select
            name="remote_office"
            className="remote-office-input"
            value={jobPost.remote_office}
            onChange={(e) =>
              setjobPost({ ...jobPost, remote_office: e.target.value })
            }
          >
            <option value="In Office">In Office</option>
            <option value="Remote">Remote</option>
          </select>
          <br></br>
          <label className="addjob-label">Location</label>
          <input
            className="location-input"
            name="location"
            placeholder="Enter Location"
            value={jobPost.location}
            onChange={(e) =>
              setjobPost({ ...jobPost, location: e.target.value })
            }
          ></input>
          <br></br>
          <label className="addjob-label">Job Description</label>
          <textarea
            className="job-description-input"
            name="job_description"
            placeholder="Type the job description"
            value={jobPost.job_description}
            onChange={(e) => {
              setjobPost({ ...jobPost, job_description: e.target.value });
            }}
          ></textarea>
          <br></br>
          <label className="addjob-label">About Company</label>
          <textarea
            className="about-info"
            name="about_company"
            placeholder="Type about your company"
            value={jobPost.about_company}
            onChange={(e) => {
              setjobPost({ ...jobPost, about_company: e.target.value });
            }}
          ></textarea>
          <br></br>
          <label className="addjob-label">Skills Required</label>
          <input
            className="jobpost-skills"
            name="skills_required"
            placeholder="Enter must have skills"
            value={jobPost.skills_required}
            onChange={(e) => {
              setjobPost({ ...jobPost, skills_required: e.target.value });
            }}
          ></input>
          <br></br>
          <label className="addjob-label">Information</label>
          <input
            className="required-info"
            name="information"
            placeholder="Enter the additional information"
            value={jobPost.information}
            onChange={(e) => {
              setjobPost({ ...jobPost, information: e.target.value });
            }}
          ></input>
          <br></br>
          <div className="addjob-btn">
            <button className="cancel-btn" onClick={navigateHomePage}>Cancel</button>
            <button type="submit" className="postjob-btn">
              Edit job
            </button>
          </div>
        </form>

        <div className="addjob-container2">
          <p className="addjob-text">Recruiter edit job details here</p>
          <img src={addjob} alt="add-job" className="addjob-logo"></img>
        </div>
      </div>
    </>
  );
}

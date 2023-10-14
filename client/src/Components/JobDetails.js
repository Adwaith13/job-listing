import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import shape1 from "../images/shape1.png";
import shape2 from "../images/shape2.png";
import shape3 from "../images/shape3.png";
import logo from "../images/money-icon.svg"
import "../style/Details.css"

export default function JobDetails() {
  const { id } = useParams();
  const [jobData, setJobData] = useState([]);
  const [userDisplay, setUserDisplay] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const fetchJobData = () => {
    axios
      .get(`https://job-listing-server.vercel.app/job/jobdata/${id}`)
      .then((res) => {
        console.log(res.data.message);
        setJobData(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUserData = () => {
    axios
      .get("https://job-listing-server.vercel.app/job/dashboard", {
        headers: {
          token: localStorage.getItem("logintoken"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserDisplay(res.data);
        setUserLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setUserLoggedIn(false);
      });
  };

  useEffect(() => {
    fetchJobData();
    fetchUserData();
  },[id]);

  const userLogout = () => {
    localStorage.removeItem("logintoken");
    setUserLoggedIn(false);
    setUserDisplay("");
  };

  const navigate = useNavigate();

  const loginPage = () => {
    navigate("/login");
  };

  const registerPage = () => {
    navigate("/register");
  };

  const navigatetoEdit=(id)=>{
    navigate(`/edit/${id}`)
  }

  return (
    <>
    
    <nav className="navbar">
        <h1 className="nav-logo">Jobfinder</h1>
        <img src={shape1} alt="shape" className="shape1"></img>
        <img src={shape2} alt="shape2" className="shape2"></img>
        <img src={shape3} alt="shape3" className="shape3"></img>
        {userLoggedIn ? (
          <div className="dashboard">
            <p className="logout" onClick={userLogout}>
              Logout
            </p>
            <p className="welcome-text">{userDisplay}</p>
          </div>
        ) : (
          <>
            <button className="nav-login" onClick={loginPage}>
              Login
            </button>
            <button className="nav-register" onClick={registerPage}>
              Register
            </button>
          </>
        )}
      </nav>
      <div className="job">
      <div className="banner">
        <p className="banner-text">
          {jobData.job_position} work from {jobData.remote_office} {jobData.job_type} at {jobData.company_name}{" "}
        </p>
      </div>

      <div className="job-information">
       <div className="top-section">
        <p className="details-job-type">{jobData.job_type}</p>
        <img src={jobData.add_logo_url} alt="logo" className="detail-logo"></img>
        <p className="details-company-name">{jobData.company_name}</p>
       </div>
       <div className="middle-section">
        <h1 className="detail-position">{jobData.job_position}</h1>
        <button className="detail-edit" onClick={()=>navigatetoEdit(jobData._id)}>Edit Job</button>
        <p className="detail-location">{jobData.location} | India</p>
        <img src={logo} alt="logo" className="cash-logo"></img>
        <span className="salary-text">Salary</span>
        <p className="detail-salary">Rs.{jobData.monthly_salary}/month</p>
       </div>
        
        <div className="third-section">
        <h1 className="about-heading">About Company</h1>
        <p className="details">{jobData.about_company}</p>
        <h2 className="about-heading">About Job/Internship</h2>
        <p className="details">{jobData.job_description}</p>
        <h2 className="about-heading">Skill(s) required</h2>
        <p className="details">{jobData.skills_required}</p>
        <h2 className="about-heading">Additional Information</h2>
        <p className="details">{jobData.information}</p>
        </div>
       
      </div>
    </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Jobs.css";
import { useNavigate } from "react-router-dom";
import shape1 from "../images/shape1.png";
import shape2 from "../images/shape2.png";
import shape3 from "../images/shape3.png";
import search from "../images/search.svg";
import inr from "../images/inr.svg";
import flag from "../images/flag.svg";

export default function Jobs() {
  
  const [jobData, setJobData] = useState([]);
  const [userDisplay, setUserDisplay] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [skills,setSkills]=useState([])
  const [selectedSkill,setSelectedSkill]=useState([])
  const [jobPosition,setJobPosition]=useState('');

  const fetchJobData = () => {
    axios
      .get("https://job-listing-server.vercel.app/jobdata")
      .then((res) => {
        console.log(res.data)
        setJobData(res.data.jobdata);
        const allSkills = res.data.jobdata.map(job => job.skills_required).join(',').split(',').map(skill => skill.trim());
        const uniqueSkills = [...new Set(allSkills)];
        setSkills(uniqueSkills)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filterSkills=()=>{
    axios.get(`https://job-listing-server.vercel.app/jobdata/?skills=${selectedSkill}`)
    .then((res)=>{
      console.log(res.data.jobdata)
      setJobData(res.data.jobdata)
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  const handleSkillChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedSkill(selectedOptions);
    selectedOptions.forEach((skill) => filterSkills(skill));
  };

  const removeSelectedSkill = (skillToRemove) => {
    const updatedSelectedSkills = selectedSkill.filter((skill) => skill !== skillToRemove);
    setSelectedSkill(updatedSelectedSkills);
    updatedSelectedSkills.forEach((skill) => filterSkills(skill));
  };

  const searchJobPosition=(e)=>{
    setJobPosition(e.target.value)
    axios.get(`https://job-listing-server.vercel.app/jobdata/?jobposition=${jobPosition}`)
    .then((res)=>{
      console.log(res.data.jobdata)
      setJobData(res.data.jobdata);

    }).catch((error)=>{
      console.log(error)
    })
  }

  const fetchUserData = () => {
    axios
      .get("https://job-listing-server.vercel.app/dashboard", {
        headers: {
          token: localStorage.getItem("logintoken"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserDisplay(res.data);
        localStorage.setItem('user',res.data)
        setUserLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setUserLoggedIn(false);
      });
  };

  const userLogout=()=>{
    localStorage.removeItem("logintoken")
    setUserLoggedIn(false)
    setUserDisplay('')
  }

  const navigate = useNavigate();

  const loginPage = () => {
    navigate("/login");
  };

  const registerPage = () => {
    navigate("/register");
  };

  const navigateJobPost=()=>{
    navigate('/jobpost')
  }

  const jobDetails = (jobID) => {
    navigate(`/details/${jobID}`);
  }

  const navigatetoEdit=(jobID)=>{
    navigate(`/edit/${jobID}`)
  }

  useEffect(() => {
    fetchJobData();
    fetchUserData();
  }, [selectedSkill]);

  return (
    <>
      <nav className="navbar">
        <h1 className="nav-logo">Jobfinder</h1>
        <img src={shape1} alt="shape" className="shape1"></img>
        <img src={shape2} alt="shape2" className="shape2"></img>
        <img src={shape3} alt="shape3" className="shape3"></img>
        {userLoggedIn ? (
          <div className="dashboard">
            <p className="logout" onClick={userLogout}>Logout</p>
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

      <div className="search-container">
        <img src={search} alt="search-icon" className="search-icon"></img>
        <input onChange={searchJobPosition}
          placeholder="Type any job title"
          className="skills-input"
        ></input>
        <br></br>
        <div className="dropdownmenu-button">
        <select className="filter-skills" value={selectedSkill} onChange={handleSkillChange} multiple>
         {skills.map((skill,i) => (
          <option key={i} value={skill}>
            {skill}
          </option>
        ))}
        </select>
        {selectedSkill.map((selectedSkill, i) => (
          <div className="display-skills">
            <div key={i} className="selected-skill">
                {selectedSkill} 
            </div>
            <div className="cancel-icon" onClick={() => removeSelectedSkill(selectedSkill)}>
              X
            </div>
          </div>
        ))}
        {userLoggedIn ? (<button className="add-job-btn" onClick={navigateJobPost}>Add Job</button>) : ""}
        </div>
          
      </div>

      <div className="job-container">
        {jobData && jobData.map((data, i) => (
          <div key={i} className="job-display">
            <div className="first-container">
              <p className="job-position">{data.job_position}</p>
              <div className="skills">
                {data.skills_required.split(",").map((skill, index) => (
                  <p key={index} className="skill">
                    {skill.trim()}
                  </p>
                ))}
              </div>
            </div>
            <div className="second-container">
              <img src={data.add_logo_url} alt="company-logo" className="company-logo"></img>
              <img src={inr} alt="rupee" className="rupee"></img>
              <p className="monthly-sal">{data.monthly_salary}</p>
              <img src={flag} alt="indian-flag" className="flag"></img>
              <p className="location">{data.location}</p>
            </div>
            <div className="third-container">
              <p className="job-type">{data.job_type}</p>
              <p className="rem-off">{data.remote_office}</p>
              <button className="view" onClick={()=>jobDetails(data._id)}>View Details</button>
              {userLoggedIn ? ( <button className="edit" onClick={()=>navigatetoEdit(data._id)}>Edit Job</button>):""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

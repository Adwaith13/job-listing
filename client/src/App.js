import React,{useEffect} from "react";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Jobs from "./Components/Jobs";
import JobPost from "./Components/JobPost";
import JobDetails from "./Components/JobDetails";
import EditJob from "./Components/EditJob";
import { Routes, Route } from "react-router-dom";

function App() {
  useEffect(() => {
    document.title = "Job Listing";
  },[]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Jobs/>}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="jobpost" element={<JobPost/>}></Route>
        <Route path="details/:id" element={<JobDetails></JobDetails>}></Route>
        <Route path="edit/:id" element={<EditJob></EditJob>}></Route>
      </Routes> 
    </>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import "../style/Login.css";
import joblogo from "../images/jobfinder.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [Users, setUsers] = useState({
    email: "",
    password: "",
  });

  const [error,setError]=useState(false)
  const navigate = useNavigate();

  const userLogin = (e) => {
    e.preventDefault();
    if(Users.email.length<0 || Users.password.length<0){
      setError(true)
    }
    axios
      .post("https://job-listing-server.vercel.app/login", Users)
      .then((response) => {
        if (response.status === 200) {
          const loginToken = response.data.loginToken; 
          localStorage.setItem('logintoken', loginToken);
          localStorage.setItem('username',response.data.message)
        }
        navigate('/')
        console.log(Users);
        setUsers({
          email: "",
          password: "",
        });
      })
      .catch((error) => {
        if(error){
          setError(true)
        }
        console.log(error);
      });
  };
  

  const btnNavigate = () => {
    navigate('/register');
  };

  return (
    <>
      <div className="login-form">
        <form className="form-inputs-login" onSubmit={userLogin}>
          <h1 className="head-login">Already have an account?</h1>
          <p className="text-login">Your personal job finder is here</p>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={Users.email}
            name="email"
            onInput={(e) => setUsers({ ...Users, email: e.target.value })}
          ></input>
          {error ? "Email does not exist" : ""}
          <br></br>
          <input
            className="input"
            type="password"
            autoComplete="password"
            placeholder="Password"
            name="password"
            value={Users.password}
            onInput={(e) => setUsers({ ...Users, password: e.target.value })}
          ></input>
          {error ? "Password does not exist" : ""}
          <br></br>
          <button className="register-btn-login">
            Sign In
          </button>
          <div className="login-text">
            <p className="account-exists-txt">Don't have an account?</p>
            <p className="signIn-text" onClick={btnNavigate}>
              Sign Up
            </p>
          </div>
        </form>
        <div className="jobfinder-logo-login">
          <p className="jobfinder-text">Your Personal Job Finder</p>
          <img src={joblogo} alt="job-logo" className="job-logo-login"></img>
        </div>
      </div>
    </>
  );
}

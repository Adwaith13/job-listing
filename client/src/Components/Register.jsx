import React, { useState } from "react";
import axios from "axios";
import "../style/Register.css"
import joblogo from '../images/jobfinder.png'
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [error,setError]=useState(false)
  const [registered]=useState(false)
  const navigate=useNavigate();

  const handleUserData = (e) => {
    e.preventDefault();
    if(newUser.name.length<2 || newUser.email.length<6 || newUser.mobile.length<10 || newUser.password.length < 0){
      setError(true)
    }
    axios
      .post("http://job-listing-server.vercel.app/auth/register", newUser)
      .then(() => {
        registered(true)
        if(registered){
          navigate('/')
        }
        console.log(newUser);
        setNewUser({
          name: "",
          email: "",
          mobile: "",
          password: "",
        });
      })
      .catch((error) => {
        if (error) {
          setError(true);
        }
        console.log(error);
      });
  };

  const btnNavigate=()=>{
    navigate('/login')
  }

  return (
    <div className="form">
        <form className="form-inputs" onSubmit={handleUserData}>
        <h1 className="head">Create an account</h1>
        <p className="text">Your personal job finder is here</p>
        {registered ? 'User Registered Successfully' : ''}
          <input className="input"
            type="input"
            placeholder="Name"
            value={newUser.name}
            name="name"
            onInput={(e) => setNewUser({ ...newUser, name: e.target.value })}
          ></input>
           {error ? <label className="error">name required</label> : ""}
          <br></br>
          <input className="input"
            type="email"
            placeholder="Email"
            name="email"
            value={newUser.email}
            onInput={(e) => setNewUser({ ...newUser, email: e.target.value })}
          ></input>
          {error  ?<label className="error">email already exists</label> : ""}
          <br></br>
          <input className="input"
            type="number"
            placeholder="Mobile"
            name="mobile"
            value={newUser.mobile}
            onInput={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
          ></input>
          {error ? <label className="error">mobile number exists</label> : ""}
          <br></br>
          <input className="input"
            type="password"
            autoComplete="password"
            placeholder="Password"
            name="password"
            value={newUser.password}
            onInput={(e) => setNewUser({ ...newUser, password: e.target.value })}
          ></input>
          {error ? <label className="error">password required</label> : ""}
          <br></br>
          <div className="tc-text">
            <input type="checkbox" className="checkbox"></input>
            <span className="tc">By creating an account, I agree to our terms of use and privacy policy</span>
          </div>
          <button className="register-btn">Create Account</button>
          <div className="login-text">
          <p className="account-exists-txt">Already have an account?</p>
          <p className="signIn-text" onClick={btnNavigate}>Sign In</p>
          </div>
        </form>
        <div className="jobfinder-logo">
          <p className="jobfinder-text">Your Personal Job Finder</p>
          <img src={joblogo} alt="job-logo" className="job-logo"></img>
        </div>
    </div>
  );
}

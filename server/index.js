//import
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors=require("cors")
const authRoutes=require("../server/routes/auth.js")
const jobRoutes=require("../server/routes/jobpost.js")

dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", service: "job listing platform",timestamp:new Date()});
});

//routes
app.use("/auth",authRoutes)
app.use("/job",jobRoutes)

//middleware to handle errors
app.use((req,res,next)=>{
  const error= new Error();
  error.status=404;
  next(error);
})

app.use((error,req,res,next)=>{
  res.status(error.status || 500).json({
    error:{
      status:error.status || 500,
      message:'Something went wrong! Please try after some time.'
    }
  })
})

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Server up and running on http://localhost:${process.env.PORT}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

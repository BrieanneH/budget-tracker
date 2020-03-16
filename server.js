const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const compression = require("compression");



const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindandModify: false
});


db.on("error", error => {
    console.log("error")
});

app.get("/", (req, res)=>{

});

app.post("/submit", (req, res)=>{

});


app.delete("/clearall", (req, res)=> {

});


 


app.listen(PORT,() => {
  console.log(`Now listening on port: ${PORT}!!`);
});




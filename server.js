const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const compression = require("compression");
const mongojs = require('mongojs');
const path = require("path");
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds231725.mlab.com:31725/heroku_hsvxk2zd`
console.log(MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget-tracker", {
  useNewUrlParser: true,
  useFindandModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// set up mongo db
const databaseURL = process.env.MONGODB_URI || "budget-tracker"
const collections = ["transaction"]


// reference mongo db
const db = mongojs(databaseURL, collections)

// if error with db, throw error
db.on("error", error => {
  console.log(`db error: ${error}`)
})

//getting routes
app.use(require('./routes/api.js'));




app.listen(PORT,() => {
  console.log(`Now listening on port: http://localhost:${PORT}`);
});


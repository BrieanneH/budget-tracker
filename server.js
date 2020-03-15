const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const compression = require("compression");



var PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

db.on("error", error => {
    console.log("error")
});
//at least psuedo coding get, post, delete, will fill in when I know what the -- I'm doing 
app.get("/", (req, res)=>{

});

app.post("/ submit", (req, res)=>{

});


app.delete("/clearall", (req, res)=> {

});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/imageperformance", {
  useNewUrlParser: true
});
 

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`Now listening on port: ${PORT}`);
});




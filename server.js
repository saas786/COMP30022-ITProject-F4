const express = require("express");
require("./services/passport");

const app = express();

const port = 5000;

var db = require('./db/db');
var bodyParser = require('body-parser')


require("./routes/authRoutes")(app);
require("./routes/artifactRoutes")(app);

app.get("/members", (req, res) => {
  db.query('SELECT * FROM user',(err,rows,fields)=>{
    if(!err)
    res.send(rows);
    else
    console.log(err);
  })
});





app.listen(port, () => console.log(`server started on port ${port}`));


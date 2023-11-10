const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
// const postsRoutes = require('./routes/posts');
const errorController = require('./controllers/error');

const app = express();

const ports = process.env.PORT || 3000;

const mysql = require("mysql");
const db = mysql.createConnection({
 
  host: "localhost",
  user: "root",
  password: "Saumya#237",
  database: "dbmsproject",

});


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Custom-Header, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use('/auth', authRoutes);

// app.use('/post', postsRoutes);
//get departments
app.get("/api/departments/", (req, res) => {
  var sql = "SELECT * FROM departments";
  db.query(sql, function (error, result) {
      console.log(error);
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

app.get("/api/departments/getName/:deptid", (req, res) => {
  var sql = "SELECT DepartmentName FROM departments WHERE DeptID=" + Number(req.params.deptid);
  db.query(sql, function (error, result) {
      console.log(error);
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

app.get("/api/users/getUsers/:deptid", (req, res) => {
  var sql = "SELECT * FROM users WHERE role='faculty' and DeptID=" + Number(req.params.deptid) ;
  db.query(sql, function (error, result) {
      console.log(error);
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

app.get("/api/users/getUserProfile/:id", (req, res) => {
  var sql = "SELECT * FROM users WHERE ID=" + Number(req.params.id) ;
  db.query(sql, function (error, result) {
      console.log(error);
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

app.post("/api/meetings/add", (req, res) => {
  let details = {
    title: req.body.title,
    starttime: req.body.starttime,
    endtime: req.body.endtime,
    scheduled_by: req.body.scheduled_by,
    scheduled_with: req.body.scheduled_with
  };

  console.log(details);

  let sql = "INSERT INTO meetings (title, starttime, endtime, scheduled_by, scheduled_with) VALUES (?, STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z'), STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z'), ?, ?)";
  
  // Extract values from the details object and create an array
  let values = [
    details.title,
    details.starttime,
    details.endtime,
    details.scheduled_by,
    details.scheduled_with
  ];

  db.query(sql, values, (error) => {
    console.log(error);
    if (error) {
      res.send({ status: false, message: "Meeting creation failed" });
    } else {
      res.send({ status: true, message: "Meeting created successfully" });
    }
  });
});



app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));


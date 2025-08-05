// Importing express module
const express = require("express");
const studentDB = require("./studentDB.json");
const fs = require('fs');
// Importing UUID V4
const {v4: uuid} = require("uuid");
const PORT = 4040;
// Instantiate your Express
const app = express();

// Welcome page  respone
app.get("/", (req, res) => {
  res.send("Welcome to Festac Hub");
});

// Using Express body-parser
app.use(express.json())

const writeToDb = (content) => {
    fs.writeFile('./studentDB.json', JSON.stringify(content, null, 2), 'utf8', (err, data) =>{
  if(err){
    console.log("Error writing file", err);
  } else {
    data
  }
  })
};

const UpdateDB = (update) => {
  fs.writeFile('./studentDB.json', JSON.stringify(update, null, 2), 'utf-8', (err, data)=>{
    if (err) {
      console.log((err.message));
    } else {
      data
    }
  })
};

// Create a new student
app.post("/create-student", (req, res) => {
  const { name, isMarried, role, gender, age } = req.body;
  const student = {
    id: uuid(),
    name,
    role,
    gender,
    age,
    isMarried
  };
  studentDB.push(student);
  writeToDb(studentDB);
  res.status(201).json({
    message: "Student created successfully",
    data: student
  })

  
});
// To view all student
app.get('/view-student', (req, res)=>{
    if (studentDB.length > 0){
    res.status(201).json({
        message: "All students below",
        data: studentDB
    })
    } else{
        res.status(200).json({
            message: "No student available"
        })
    };
  })

  // Get one Student
  app.get('/student/:id', (req, res)=> {
    const id = req.params.id;
    const student = studentDB.find((e)=> e.id === id )
    if (!student){
        res.status(404).json({
            message: 'Student not found'
        })
    }else {
        res.status(200).json({
            message: 'Student found',
            data: student
        })
    }
  });
  
  app.put('/student/:id', (req, res) => {
    const id = req.params.id;
    const {name, isMarried, age, role, gender} = req.body
    const studentIndex = studentDB.findIndex((e)=> e.id === id )
    if (studentIndex === -1){
        res.status(404).json({
            message: 'Student not found'
        })
    }else {
       const updatedData = {
        name,
        role,
        gender,
        age,
        isMarried
       };
       let update = {...studentDB[studentIndex], ...updatedData}
       UpdateDB(studentDB)
    
      res.status(200).json({
      message: 'Student updated successfully',
      data: update
    })
    };
  })

  // To delete a student
  app.delete('/delete-student/:id', (req, res) => {
     const id = req.params.id;
    const student = studentDB.filter((e)=> e.id === id);
    if (!student){
        res.status(404).json({
            message: 'Student not found'
        })
    }else {
        res.status(200).json({
            message: 'Student deleted',
            data: student
        })
    }

  })
  
// Listen to a PORT
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

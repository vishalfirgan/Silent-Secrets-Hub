//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// console.log(process.env.SECRET);

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {

    res.render("home");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/register", (req, res) => {
   
    const newuser = new User({
        email: req.body.username,
        password: req.body.password
      
    });

    newuser.save()
        .then(() => {
            res.render("secrets");
        })
        .catch((err) => { console.log(err); })
});
// app.post("/login", (req, res) => {

//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({ password: password })
//         .then((founduser) => {
//             if (founduser.email === username) {
//                 res.render("secrets");
//                 console.log(password);
//             }
        
//         })
//         .catch((err) => { console.log(err); });
// })
app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
  
    User.findOne({ email: email })
      .then((foundUser) => {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          } else {
            console.log("Incorrect password");
            res.redirect("/login");
          }
        } else {
          console.log("User not found");
          res.redirect("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });











app.listen(3000, () => { console.log("server running at port 3000") });
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// console.log(process.env.API_KEY);
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save((err) => {
    if (err) console.log(err);
    else res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) console.log(err);
    else {
      if (foundUser) {
        if (foundUser.password == password) {
          res.render("secrets");
        }
      }
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => `Server running on port ${port} 🔥`);

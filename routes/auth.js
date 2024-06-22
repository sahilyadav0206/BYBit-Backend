const express = require("express");
const UserData = require("../models/UserData");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = new express.Router();

const saltRounds = 10;
const jwtSecret = "BuyBitEncryptoSahilYadav";
router.get("/check-auth", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).send("Not authenticated");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).send({ user: decoded });
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Create associated user data
    const userData = new UserData({
      userId: newUser._id,
    });
    await userData.save();

    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user: " + error.message);
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Password is incorrect");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is only true in production
      sameSite: "strict",
    });
    // res.status(200).json({ authToken: token });
    res.send({ message: "Login successful" });
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

router.post("/logout", (req, res) => {
  console.log("Logout");
  res.clearCookie("authToken", {
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
  });
  res.status(200).send("Logout successful");
});

module.exports = router;

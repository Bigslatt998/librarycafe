import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import RegisterRoute from './src/routes/Register.js';   
import LoginRoute from './src/routes/Login.js';
import BookmarkRoute from './src/routes/Bookmark.js';
// import UserRoute from './src/routes/UserAuth.js';
import User from './src/Schema/RegistrationSchema.js'
import VerificationCode from './src/Schema/VSchema.js'
// import path from 'path';
import path from 'node:path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import {connectDB} from './src/config/db.js'
import { readFileSync } from 'node:fs';
const app = express();
await connectDB()
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173',
      'http://172.20.10.3:5173',
      'https://bigslatt998.github.io',
      'https://bigslatt998.github.io/librarycafe',
      'https://librarycafe-api.onrender.com',
      'https://librarycafe-csuo.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));
app.use("/api/register", RegisterRoute)
app.use("/api/login", LoginRoute)
app.use("/api/bookmark", BookmarkRoute)
// app.use('/api', UserRoute)
app.get("/api/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, "ezFdYUp5A05KuUXtCab9f4Mf6hUBl8PmxPaUwiVVF3B7eqYayhsHSTTkVms0BXSy");
    console.log("Decoded:", decoded);
    const user = await User.findById(decoded.userId).select("Username");
console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, 
      user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// app.use('/forgot-password', ForgetPassword)
// app.get("/api/user", async (req, res) => {
  
// });

app.get("/forgot-password", (req, res) => {
    res.send('forget password working')
})

const generateCode = () => Math.floor(10000 + Math.random() * 90000).toString();

app.post("/forgot-password", async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ Email: email });
    if (!user) return res.status(404).json({ success: false, message: "Email not found" });

    const code = generateCode();

     user.verificationCode = code;
    user.verificationCodeExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationCode.deleteMany({ email });
    await VerificationCode.create({ email, code, expiresAt });

    // In production: send via email
    res.json({ success: true, message: "Verification code sent", code });
    console.log("Stored:", user.verificationCode, typeof user.verificationCode);
console.log("Received:", code, typeof code);
  } catch (error) {
    console.error("Request Reset Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required"
      });
    }

    const user = await User.findOne({ Email: email.trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare codes as strings
    if (String(user.verificationCode) !== String(code)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code"
      });
    }

    // Check expiry
    if (user.verificationCodeExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Code verified successfully"
    });

  } catch (err) {
    console.error("Error verifying code:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Reset Username
app.post("/reset-username", async (req, res) => {
  try {
    const { email, newUsername } = req.body;

    if (!email || !newUsername) {
      return res.status(400).json({
        success: false,
        message: "Email and new username are required",
      });
    }
     // Find user
    const user = await User.findOne({ Email: email.trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.Username = newUsername.trim();

  // Clear Code
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
    });
  } catch (err) {
    console.error("Error resetting username:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// Reset password
app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }
    // Find user
    const user = await User.findOne({ Email: email.trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.Password = hashedPassword;

    // Clear verification fields
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const API_KEY = 'fa0b168a4ee848849467c54975ba3252'

app.get("/api/news", async (req, res) => {
  try {
    const { category = "general", page = 1, pageSize = 10 } = req.query;

    const url = new URL("https://newsapi.org/v2/top-headlines");
    url.searchParams.append("category", category);
    url.searchParams.append("language", "en");
    url.searchParams.append("page", page);
    url.searchParams.append("pageSize", pageSize);
    url.searchParams.append("apiKey", API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});


app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(PORT, () => {
    let time = Date.now()
    let TimeNow = new Date(time)
    const Localtime = TimeNow.toLocaleString()
    console.log(`Server connected to http: ${PORT} ${Localtime}`)
})


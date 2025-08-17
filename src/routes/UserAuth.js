// // routes/user.js
// import express from "express";
// import jwt from "jsonwebtoken";
// import User from '../Schema/RegistrationSchema.js'


// const router = express.Router();

// router.get("/me", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decoded = jwt.verify(token, "ezFdYUp5A05KuUXtCab9f4Mf6hUBl8PmxPaUwiVVF3B7eqYayhsHSTTkVms0BXSy");
//     console.log("Decoded:", decoded);
//     const user = await User.findById(decoded.userId).select("Username");
// console.log("User found:", user);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.json({ success: true, 
//       user });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;

import express from 'express'
const router = express.Router()
import User from '../Schema/RegistrationSchema.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

router.get("/", async (req, res) => {
    res.json({ message: 'Login route is working' })
})

router.post("/", async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validate input
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username and Password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ Email: emailOrUsername }, { Username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      'ezFdYUp5A05KuUXtCab9f4Mf6hUBl8PmxPaUwiVVF3B7eqYayhsHSTTkVms0BXSy',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Username: user.Username,
          Email: user.Email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

export default router
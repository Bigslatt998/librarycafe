import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Schema/RegistrationSchema.js'
import mongoose from 'mongoose';

const router = express.Router()


router.post("/", async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const Userid = uuidv4();
        const { Firstname, Lastname, Username, Email, Password, ConfirmPassword } = req.body;
        const TTime = new Date().toLocaleString();

        // Validation
        if (!Firstname || !Lastname || !Username || !Email || !Password || !ConfirmPassword) {
            return res.status(400).send('All fields are required');
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        // Check if email already exists in DB
        const EmailExist = await User.findOne({ Email });
        if (EmailExist) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        //  Check if username already exists in DB
        const userExist = await User.findOne({ Username});
        if (userExist) {
            return res.status(400).json({ success: false, error: 'Username already taken' });
        }

        if (Password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
        }

        if (Password.length > 12) {
            return res.status(400).json({ success: false, error: `Password can't be more than 12 characters long` });
        }
        // 🔹 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUsers = await User.create([{
            id: Userid,
            Firstname,
            Lastname,
            Username,
            Email,
            Password: hashedPassword,
            TTime
        }], {session})

        const token = jwt.sign({ userId: newUsers[0]._id },
            'ezFdYUp5A05KuUXtCab9f4Mf6hUBl8PmxPaUwiVVF3B7eqYayhsHSTTkVms0BXSy',
            { expiresIn: '1h' }
        );
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, 
            message: 'User registered successfully',
            data: {
            token,
            user: newUsers[0]
            }
         });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Registration error:', error);
        res.status(500).json({ success: false, 
            error: 'Internal server error' });
        next(error)
    }
})


export default router;
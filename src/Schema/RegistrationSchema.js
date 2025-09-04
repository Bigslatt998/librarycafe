import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  Firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  verificationCode: { type: String },
  verificationCodeExpiry: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
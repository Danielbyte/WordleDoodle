import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  otp: {
    type: String //OTP for verification
  },
  otpExpiry: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minLength: 8
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
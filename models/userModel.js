import mongoose from "mongoose";

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
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minLength: 8
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
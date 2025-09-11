import mongoose from "mongoose"
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { sendOtpEmail } from "../utils/send-email.js";

export const register = async (req, res, next) => {
  //Implement user registration logic
  const session = await mongoose.startSession();
  session.startTransaction();

  //Databases should be atomic (An operation can either complete or fail (no in between))
  //This is to prevent errors down the line
  try {
    // Try to create a new user

    //destructure the passed values from the front-end
    const { username, email, password } = req.body;

    //check if a user already exists
    const userExists = await User.findOne({email});

    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 409
      throw error
    }

    //Hash the password for the new user (in the case that user doesn't exist in the db)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //Hash the plain user password with the generated salt

    //Generate OTP and OTP expiry period
    const otp = generateOTP();
    const otpExpiryPeriod = 10 * 60 * 1000; //otp will be invalid after 10 minutes
    const otpExpiry = new Date(Date.now() + otpExpiryPeriod);
    //Send otp
    await sendOtpEmail(email, otp);

    //create new User
    const newUsers = await User.create([{username, email, password: hashedPassword, otp: otp, otpExpiry: otpExpiry}], {session});

    //Generate a token for the user so they can login
    const token = jwt.sign({userId: newUsers[0]._id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    //At the end, commit this transaction (meaning everything went successfully)
    await session.commitTransaction();
    session.endSession();

    //Store email in session
    req.session.email = email;

    //To avoid making unnecessary calls to db, will just add the otp to the session as well
    req.session.otp = otp;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUsers[0]
      }
    });
  } catch (error) {
    //If anything goes wrong, just immediatley abort mission
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({email}); //search user by email address

    //If user doesn't exist
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    //If the user exist, we verify the password
    //Compare the password the user is using to login against the one that is in the db
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    //Entered password is valid, generate a new token
    const token = jwt.sign({userId: user._id }, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user
      }
    });

  } catch (error) {
    next(error); //Forward error to error handling middleware
  }
}

export const logout = async (req, res, next) => {}

export const mainMenu = (req, res) => {
  req.session.token = req.headers.authorization;
  res.json({redirectUrl: '/menu'});
}

const generateOTP = () => crypto.randomInt(100000, 999999).toString(); //Randomly generate a six digit number === OTP
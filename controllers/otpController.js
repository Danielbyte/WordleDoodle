import mongoose from "mongoose";
import User from "../models/userModel.js";
import { sendOtpEmail } from "../utils/send-email.js";
import crypto from 'crypto';

export const verifyOTP = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Try verifying the OTP entered by the user
    const { otp } = req.body;
    const email = req.session.email;
    const user = await User.findOne({email});
    
    //Check if user exists in the db
    if (!user) return res.status(400).json({message: 'User not found'});
    if (user.isVerified) return res.status(400).json({message: 'User already verified'});

    if (user.otp !== otp) return res.status(400).json({message: 'OTP incorrect'});
    if (user.otpExpiry < new Date()) return res(400).json({message: 'OTP Expired'});

    //Verify user
    user.isVerified = true;
    user.otpExpiry = undefined;

    //Save user
    await user.save();
    //Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({message: 'Error verifying OTP', error});
    next(error);
  }
}

export const resendOTP = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const email = req.session.email;
    const user = await User.findOne({email});

    if (!user) return res.status(404).json({message: 'User not found'});
    if (user.isVerified) return res.status(400).json({message: 'Account already verified'});

    const otp = generateOTP();
    user.otp = otp;
    const otpExpiryPeriod = 600000;
    user.otpExpiry = new Date(Date.now() + otpExpiryPeriod);

    //Send otp
    await sendOtpEmail(email, otp);
    
    await user.save();
    //Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'OTP resent successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({message: 'Error resending OTP', error});
  }
}

const generateOTP = () => crypto.randomInt(100000, 999999).toString(); //Randomly generate a six digit number === OTP
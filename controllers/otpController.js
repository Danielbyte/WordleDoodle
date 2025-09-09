import mongoose from "mongoose";
import User from "../models/userModel.js";

export const verifyOTP = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Try verifying the OTP entered by the user
    const {email, otp } = req.body;
    const user = User.findOne({email});

    //Check if user exists in the db
    if (!user) return res.status(400).json({message: 'User not found'});
    if (user.isVerified) return res.status(400).json({message: 'User already verified'});

    if (user.otp !== otp) return res.status(400).json({message: 'OTP incorrect'});
    if (user.otpExpiry < new Date()) return res(400).json({message: 'OTP Expired'});

    //Verify user
    user.isVerified = true;
    user.otpExpiry = undefined;
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
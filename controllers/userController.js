//This file handles the logic to authorize users so that they can interact with the database
import User from "../models/userModel.js";
import Stats from "../models/userStats.js";

export const getUser = async (req, res, next) => {
  try {
    //fetch all users
    const user = await User.findById(req.params.id).select('-password'); //Get all user info except for the password

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({success: true, data: user});
  } catch (error) {
    next(error);
  }
}

export const getUserStats = async (req, res, next) => {
  try {
    //Check if the user is the same as the one in the token
    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    //Get the user stats
    const statistics = await Stats.find({stats: req.params.id});
    res.status(200).json({success: true, data: statistics});
  } catch (e) {
    next(e);
  }
}
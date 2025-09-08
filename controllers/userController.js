//This file handles the logic to authorize users so that they can interact with the database
import User from "../models/userModel.js";

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
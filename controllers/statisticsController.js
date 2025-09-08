import Stats from "../models/userStats.js";

export const createUserStats = async (req, res, next) => {
  try {
    const statistics = await Stats.create({
      //Pass everything user passes in the body of the request
      ...req.body,
      //For which user are we creating the stats.
      user: req.user._id, //This is coming from the middleware that comes before creating any subscription
    });

    res.status(201).json({success: true, data: statistics})
  } catch (e) {
    next(e);
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
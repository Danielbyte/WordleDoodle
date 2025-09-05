import mongoose from "mongoose"

export const register = async (req, res, next) => {
  //Implement user registration logic
  const session = await mongoose.startSession()
  session.startTransaction();

  //Databases should be atomic (An operation can either complete or fail (no in between))
  //This is to prevent errors down the line
  try {
    // Try to create a new user

    //At the end, commit this transaction (meaning everything went successfully)
    await session.commitTransaction();
  } catch (error) {
    //If anything goes wrong, just immediatley abort mission
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export const login = async (req, res, next) => {}

export const logout = async (req, res, next) => {}
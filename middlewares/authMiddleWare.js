//Authentication middleware to protect routes

import { JWT_SECRET } from '../config/env.js';
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

const authorize = async (req, res, next) => {
  try {
    //Access the user token
    let token;

    //When you pass a token through the request header, it starts with the word Bearer (as a protocol)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({message: 'Unauthorized'});

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({message: 'Unauthorized'});

    //Attach user to the req being made
    req.user = user;
    next();
    
  } catch (error) {
    res.status(401).json({message: 'Unauthorized', error: error.message});
    next(error);
  }
}

export default authorize;
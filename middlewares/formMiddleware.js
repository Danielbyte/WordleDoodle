import { JWT_SECRET } from '../config/env.js';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authorizePage = async (req, res, next) => {
  try {
    let token;

    if (req.session.token && req.session.token.startsWith('Bearer')) {
      token = req.session.token.split(' ')[1];
    }

    if (!token) return res.status(401).json({message: 'Unauthorized'});

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({message: 'Unauthorized'});

    next();
  } catch (error) {
    res.status(401).json({message: 'Unauthorized', error: error.message});
    next(error);
  }
}

export default authorizePage;
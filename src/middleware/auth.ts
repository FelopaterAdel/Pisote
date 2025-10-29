import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const secret = process.env.JWT_SECRET || 'your-default-secret';
    const decoded = jwt.verify(token, secret) as { _id: string };
    
    // You can add user fetching here if needed
    // const user = await User.findOne({ _id: decoded._id });
    
    req.user = decoded as any;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-default-secret';
  return jwt.sign({ _id: userId }, secret, { expiresIn: '7d' });
};
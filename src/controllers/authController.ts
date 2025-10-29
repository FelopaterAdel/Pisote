import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { generateToken } from '../middleware/auth';
import Joi from 'joi';

// Validation schemas
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  educationLevel: Joi.string().required(),
  subjects: Joi.array().items(Joi.string())
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const authController = {
  // User registration
  async signup(req: Request, res: Response) {
    try {
      // Validate request body
      const { error } = signupSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

  // Create new user
  const user = new User(req.body) as IUser;
  await user.save();

  // Generate token
  const token = generateToken((user._id as unknown as string).toString());

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          educationLevel: user.educationLevel,
          subjects: user.subjects
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  // User login
  async login(req: Request, res: Response) {
    try {
      // Validate request body
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Find user
      const user = await User.findOne({ email: req.body.email }) as IUser | null;
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password
      const isValidPassword = await user.comparePassword(req.body.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

  // Generate token
  const token = generateToken((user._id as unknown as string).toString());

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          educationLevel: user.educationLevel,
          subjects: user.subjects
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  },

  // Get user profile
  async getProfile(req: Request & { user?: IUser }, res: Response) {
    try {
      const user = await User.findById(req.user?._id)
        .select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching profile' });
    }
  }
};
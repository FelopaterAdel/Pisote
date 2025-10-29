import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router } from './routes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pisote_db';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
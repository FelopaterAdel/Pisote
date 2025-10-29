import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  arabicName: string;
  educationLevel: string;
  bookPdfUrl: string;
  lessons: {
    title: string;
    arabicTitle: string;
    content: string;
    aiPrompt: string;
    quizzes: {
      question: string;
      options: string[];
      correctAnswer: string;
    }[];
  }[];
}

const SubjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  arabicName: {
    type: String,
    required: true,
    trim: true
  },
  educationLevel: {
    type: String,
    required: true,
    ref: 'EducationLevel'
  },
  bookPdfUrl: {
    type: String,
    required: true,
    trim: true
  },
  lessons: [{
    title: {
      type: String,
      required: true
    },
    arabicTitle: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    aiPrompt: {
      type: String,
      required: true
    },
    quizzes: [{
      question: {
        type: String,
        required: true
      },
      options: [{
        type: String,
        required: true
      }],
      correctAnswer: {
        type: String,
        required: true
      }
    }]
  }]
});

export default mongoose.model<ISubject>('Subject', SubjectSchema);
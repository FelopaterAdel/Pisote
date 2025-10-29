import mongoose, { Schema, Document } from 'mongoose';

export interface IEducationLevel extends Document {
  name: string;
  arabicName: string;
  grade: number;
  description: string;
  subjects: string[];
}

const EducationLevelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  arabicName: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subjects: [{
    type: String,
    ref: 'Subject'
  }]
});

export default mongoose.model<IEducationLevel>('EducationLevel', EducationLevelSchema);
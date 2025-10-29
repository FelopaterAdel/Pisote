import { Request, Response } from 'express';
import Subject from '../models/Subject';
import EducationLevel from '../models/EducationLevel';
import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv';
configDotenv();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const educationController = {
  // Get all education levels
  async getEducationLevels(req: Request, res: Response) {
    try {
      const levels = await EducationLevel.find();
      res.json(levels);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching education levels' });
    }
  },

  // Get subjects by education level
  async getSubjectsByLevel(req: Request, res: Response) {
    try {
      const { levelId } = req.params;
      const subjects = await Subject.find({ educationLevel: levelId });
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching subjects' });
    }
  },

  // Get lesson content with AI explanation
  async getLessonWithAI(req: Request, res: Response) {
    try {
      const { subjectId, lessonId } = req.params;
      const subject = await Subject.findById(subjectId);
      
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const lesson = subject.lessons.find((l: any) => l._id?.toString() === lessonId || l.id === lessonId);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Get AI explanation
      const aiExplanation = await getAIExplanation(lesson.aiPrompt);

      res.json({
        lesson,
        aiExplanation
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching lesson' });
    }
  },

  // Generate quiz for a lesson
  async generateQuiz(req: Request, res: Response) {
    try {
      const { subjectId, lessonId } = req.params;
      const subject = await Subject.findById(subjectId);
      
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      const lesson = subject.lessons.find((l: any) => l._id?.toString() === lessonId || l.id === lessonId);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Get AI-generated quiz
      const quiz = await generateAIQuiz(lesson.content);

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: 'Error generating quiz' });
    }
  }
};

// Helper function to get AI explanation
async function getAIExplanation(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful educational assistant that explains concepts in Arabic clearly and simply, suitable for students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content || 'No explanation generated';
  } catch (error) {
    console.error('Error getting AI explanation:', error);
    throw error;
  }
}

// Helper function to generate AI quiz
async function generateAIQuiz(lessonContent: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate a quiz with 5 multiple-choice questions in Arabic based on the following lesson content. Format the response as JSON with questions, options, and correct answers."
        },
        {
          role: "user",
          content: lessonContent
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}
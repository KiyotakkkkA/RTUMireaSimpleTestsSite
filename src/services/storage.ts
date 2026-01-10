import { QuizSession, LOCAL_STORAGE_KEYS } from '../types/quiz';
import type { QuizQuestion } from '../tests/RBD';

export const StorageService = {
  getSession: (): QuizSession | null => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.QUIZ_SESSION);
    return data ? JSON.parse(data) : null;
  },

  saveSession: (session: QuizSession): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUIZ_SESSION, JSON.stringify(session));
  },

  clearSession: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.QUIZ_SESSION);
  },
  clear: (): void => {
    StorageService.clearSession();
  },
};

export const QuizService = {
  isAnswerCorrect: (question: QuizQuestion, userAnswer: number[] | string[]): boolean => {
    if (question.type === 'matching') {
      const ua = Array.isArray(userAnswer) ? (userAnswer as string[]) : [];
      return ua.length === question.correctAnswers.length && question.correctAnswers.every((c) => ua.includes(c));
    }
    
    if (question.type === 'single' || question.type === 'multiple') {
      const ua = Array.isArray(userAnswer) ? (userAnswer as number[]) : [];
      if (ua.length !== question.correctAnswers.length) return false;
      return question.correctAnswers.every((c) => ua.includes(c));
    }

    return false;
  },
};

export interface QuizSession {
  quizId: string;
  currentQuestionIndex: number;
  userAnswers: Record<number, number[] | string[]>;
  startTime: number;
  endTime?: number;
  settings?: QuizSettings;
  mode?: 'normal' | 'express';
  questionIds?: number[];
  timeLimitSeconds?: number;
}

export interface QuizSettings {
  passThreshold: number;
  hintsEnabled: boolean;
  checkAfterAnswer: boolean;
  showIncorrectAtEnd: boolean;
}

export interface IncorrectReviewItem {
  questionNumber: number;
  questionText: string;
  correctAnswersText: string[];
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeSpent: number;
  passThreshold?: number;
  passed?: boolean;
  settings?: QuizSettings;
  incorrectReview?: IncorrectReviewItem[];
  answers: {
    questionId: number;
    userAnswer: number[] | string[];
    correct: boolean;
  }[];
}

export const LOCAL_STORAGE_KEYS = {
  QUIZ_SESSION: 'testix_quiz_session',
};

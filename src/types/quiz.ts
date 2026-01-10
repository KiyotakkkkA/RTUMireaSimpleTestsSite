export interface QuizSession {
  quizId: string;
  currentQuestionIndex: number;
  userAnswers: Record<number, number[] | string[]>;
  startTime: number;
  endTime?: number;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  timeSpent: number;
  answers: {
    questionId: number;
    userAnswer: number[] | string[];
    correct: boolean;
  }[];
}

export const LOCAL_STORAGE_KEYS = {
  QUIZ_SESSION: 'testix_quiz_session',
};

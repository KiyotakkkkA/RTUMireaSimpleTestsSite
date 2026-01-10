import { useState, useEffect, useCallback } from 'react';
import { QuizSession, QuizResult } from '../types/quiz';
import { StorageService, QuizService } from '../services/storage';
import type { QuizQuestion } from '../tests/RBD';

export const useQuiz = (quizId: string | null, questions: QuizQuestion[]) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const savedSession = StorageService.getSession();

    if (savedSession) {
      setSession(savedSession);
    }
  }, []);

  const startQuiz = useCallback(() => {
    if (!quizId) return;
    const newSession: QuizSession = {
      quizId,
      currentQuestionIndex: 0,
      userAnswers: {},
      startTime: Date.now(),
    };
    setSession(newSession);
    setStartTime(Date.now());
    StorageService.saveSession(newSession);
  }, [quizId]);

  const saveAnswer = useCallback((questionId: number, answer: number[] | string[]) => {
    if (!session) return;

    const updatedSession: QuizSession = {
      ...session,
      userAnswers: {
        ...session.userAnswers,
        [questionId]: answer,
      },
    };

    setSession(updatedSession);
    StorageService.saveSession(updatedSession);
  }, [session]);

  const nextQuestion = useCallback(() => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      const updatedSession: QuizSession = {
        ...session,
        currentQuestionIndex: nextIndex,
      };
      setSession(updatedSession);
      StorageService.saveSession(updatedSession);
    }
  }, [session, questions.length]);

  const prevQuestion = useCallback(() => {
    if (!session || session.currentQuestionIndex === 0) return;

    const updatedSession: QuizSession = {
      ...session,
      currentQuestionIndex: session.currentQuestionIndex - 1,
    };
    setSession(updatedSession);
    StorageService.saveSession(updatedSession);
  }, [session]);

  const finishQuiz = useCallback(() => {
    if (!session) return;

    const now = Date.now();
    const timeSpent = Math.floor((now - session.startTime) / 1000);

    let correctCount = 0;
    const answers = questions.map((question) => {
      const userAnswer = session.userAnswers[question.id] || [];
      const correct = QuizService.isAnswerCorrect(question, userAnswer);
      if (correct) correctCount++;
      return {
        questionId: question.id,
        userAnswer,
        correct,
      };
    });

    const finalResult: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      percentage: Math.round((correctCount / questions.length) * 100),
      timeSpent,
      answers,
    };

    setResult(finalResult);    // По требованиям: после завершения показываем результат и чистим localStorage
    StorageService.clear();
  }, [session, questions]);

  const resetQuiz = useCallback(() => {
    StorageService.clear();
    setSession(null);
    setResult(null);
    setStartTime(0);
  }, []);

  return {
    session,
    result,
    startQuiz,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
    currentQuestion: session ? questions[session.currentQuestionIndex] : null,
    progress: session ? ((session.currentQuestionIndex + 1) / questions.length) * 100 : 0,
  };
};

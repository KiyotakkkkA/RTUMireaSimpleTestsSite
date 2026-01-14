import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { IncorrectReviewItem, QuizSession, QuizResult, QuizSettings } from '../types/quiz';
import { StorageService, QuizService } from '../services/storage';
import type { QuizQuestion } from '../tests/RBD';

export const useQuiz = (quizId: string | null, questions: QuizQuestion[]) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<QuizSettings | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const timedOutRef = useRef(false);

  useEffect(() => {
    const savedSession = StorageService.getSession();

    if (savedSession) {
      setSession(savedSession);
    }
  }, []);

  const activeQuestions: QuizQuestion[] = useMemo(() => {
    if (!session?.questionIds || session.questionIds.length === 0) return questions;
    const byId = new Map<number, QuizQuestion>();
    questions.forEach((q) => byId.set(q.id, q));
    return session.questionIds
      .map((id) => byId.get(id))
      .filter((q): q is QuizQuestion => Boolean(q));
  }, [questions, session?.questionIds]);

  const getDefaultSettings = useCallback((): QuizSettings => {
    const total = Math.max(1, questions.length);
    return {
      passThreshold: Math.min(total, Math.max(1, Math.ceil(total * 0.85))),
      hintsEnabled: false,
      checkAfterAnswer: false,
      showIncorrectAtEnd: false,
    };
  }, [questions.length]);

  useEffect(() => {
    if (!quizId) {
      setSettingsDraft(null);
      return;
    }
    if (session?.quizId === quizId && session.settings) {
      setSettingsDraft(session.settings);
      return;
    }
    setSettingsDraft(getDefaultSettings());
  }, [quizId, questions.length, session?.quizId, session?.settings, getDefaultSettings]);

  const startQuiz = useCallback((opts?: {
    mode?: 'normal' | 'express';
    questionIds?: number[];
    settings?: QuizSettings;
    timeLimitSeconds?: number;
  }) => {
    if (!quizId) return;
    const now = Date.now();
    const settings = opts?.settings ?? settingsDraft ?? getDefaultSettings();
    const newSession: QuizSession = {
      quizId,
      currentQuestionIndex: 0,
      userAnswers: {},
      startTime: now,
      settings,
      mode: opts?.mode ?? 'normal',
      questionIds: opts?.questionIds,
      timeLimitSeconds: opts?.timeLimitSeconds,
    };
    timedOutRef.current = false;
    setTimeLeftSeconds(
      typeof newSession.timeLimitSeconds === 'number'
        ? Math.max(0, Math.ceil(newSession.timeLimitSeconds))
        : null
    );
    setSession(newSession);
    StorageService.saveSession(newSession);
  }, [quizId, getDefaultSettings, settingsDraft]);

  const updateSettings = useCallback((partial: Partial<QuizSettings>) => {
    const total = Math.max(1, questions.length);
    const base = session?.settings ?? settingsDraft ?? getDefaultSettings();
    const next: QuizSettings = { ...base, ...partial };

    next.passThreshold = Math.min(total, Math.max(1, Math.round(next.passThreshold)));

    if (session) {
      const updatedSession: QuizSession = {
        ...session,
        settings: next,
      };

      setSession(updatedSession);
      StorageService.saveSession(updatedSession);
    } else {
      setSettingsDraft(next);
    }
  }, [session, questions.length, getDefaultSettings, settingsDraft]);

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
    if (nextIndex < activeQuestions.length) {
      const updatedSession: QuizSession = {
        ...session,
        currentQuestionIndex: nextIndex,
      };
      setSession(updatedSession);
      StorageService.saveSession(updatedSession);
    }
  }, [session, activeQuestions.length]);

  const prevQuestion = useCallback(() => {
    if (!session || session.currentQuestionIndex === 0) return;

    const updatedSession: QuizSession = {
      ...session,
      currentQuestionIndex: session.currentQuestionIndex - 1,
    };
    setSession(updatedSession);
    StorageService.saveSession(updatedSession);
  }, [session]);

  const goToQuestion = useCallback((index: number) => {
    if (!session) return;
    const nextIndex = Math.min(
      Math.max(0, index),
      Math.max(0, activeQuestions.length - 1)
    );
    if (nextIndex === session.currentQuestionIndex) return;

    const updatedSession: QuizSession = {
      ...session,
      currentQuestionIndex: nextIndex,
    };
    setSession(updatedSession);
    StorageService.saveSession(updatedSession);
  }, [session, activeQuestions.length]);

  const finishQuiz = useCallback(() => {
    if (!session) return;

    const now = Date.now();
    const timeSpent = Math.floor((now - session.startTime) / 1000);

    let correctCount = 0;
    const answers = activeQuestions.map((question) => {
      const userAnswer = session.userAnswers[question.id] || [];
      const correct = QuizService.isAnswerCorrect(question, userAnswer);
      if (correct) correctCount++;
      return {
        questionId: question.id,
        userAnswer,
        correct,
      };
    });

    const settings = session.settings ?? getDefaultSettings();
    const passThreshold = Math.min(
      activeQuestions.length,
      Math.max(1, Math.round(settings.passThreshold))
    );

    const incorrectReview: IncorrectReviewItem[] | undefined = settings.showIncorrectAtEnd
      ? activeQuestions
          .map((question, index) => {
            const userAnswer = session.userAnswers[question.id] || [];
            const correct = QuizService.isAnswerCorrect(question, userAnswer);
            if (correct) return null;

            if (question.type === 'single' || question.type === 'multiple') {
              const correctAnswersText = question.correctAnswers
                .slice()
                .sort((a, b) => a - b)
                .map((i) => question.options[i])
                .filter(Boolean);
              return {
                questionNumber: index + 1,
                questionText: question.question,
                correctAnswersText,
              };
            }

            if (question.type === 'matching') {
              const correctAnswersText = question.correctAnswers.map((pair) => {
                const termKey = pair.substring(0, 1);
                const meaningIndex = Number(pair.substring(1));
                const termText = question.terms[termKey];
                const meaningText = question.meanings[meaningIndex];
                return `${termKey}: ${termText} — ${meaningText}`;
              });
              return {
                questionNumber: index + 1,
                questionText: question.question,
                correctAnswersText,
              };
            }

            return null;
          })
          .filter((x): x is IncorrectReviewItem => Boolean(x))
      : undefined;

    const finalResult: QuizResult = {
      totalQuestions: activeQuestions.length,
      correctAnswers: correctCount,
      percentage: Math.round((correctCount / Math.max(1, activeQuestions.length)) * 100),
      timeSpent,
      passThreshold,
      passed: correctCount >= passThreshold,
      settings,
      incorrectReview,
      answers,
    };

    setResult(finalResult);
    StorageService.clear();
  }, [session, activeQuestions, getDefaultSettings]);

  useEffect(() => {
    if (!session?.timeLimitSeconds || session.timeLimitSeconds <= 0) {
      setTimeLeftSeconds(null);
      return;
    }

    const limitSeconds = session.timeLimitSeconds;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      const left = Math.max(0, Math.ceil(limitSeconds - elapsed));
      setTimeLeftSeconds(left);

      if (left <= 0 && !timedOutRef.current) {
        timedOutRef.current = true;
        finishQuiz();
      }
    };

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [session?.startTime, session?.timeLimitSeconds, finishQuiz]);

  const resetQuiz = useCallback(() => {
    StorageService.clear();
    setSession(null);
    setResult(null);
    setTimeLeftSeconds(null);
    timedOutRef.current = false;
  }, []);

  return {
    session,
    result,
    startQuiz,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    finishQuiz,
    resetQuiz,
    updateSettings,
    settings: session?.settings ?? settingsDraft ?? (quizId ? getDefaultSettings() : null),
    questions: activeQuestions,
    currentQuestion: session ? activeQuestions[session.currentQuestionIndex] : null,
    progress: session
      ? ((session.currentQuestionIndex + 1) / Math.max(1, activeQuestions.length)) * 100
      : 0,
    timeLeftSeconds,
  };
};

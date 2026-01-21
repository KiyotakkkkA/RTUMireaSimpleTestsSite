import { LOCAL_STORAGE_KEYS, type TestQuestion, type TestResult, type TestSession } from '../types/Test';

export const StorageService = {
  getSession: (): TestSession | null => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.TEST_SESSION);
    return data ? JSON.parse(data) : null;
  },

  getCurrentTestId: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_TEST_ID);
  },

  saveSession: (session: TestSession): void => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEST_SESSION, JSON.stringify(session));
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_TEST_ID, session.testId);
  },

  getResult: (testId: string): TestResult | null => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.TEST_RESULT);
    if (!data) return null;
    const parsed = JSON.parse(data) as { testId: string; result: TestResult };
    if (!parsed || parsed.testId !== testId) return null;
    return parsed.result ?? null;
  },

  saveResult: (testId: string, result: TestResult): void => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.TEST_RESULT,
      JSON.stringify({ testId, result })
    );
  },

  clearResult: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TEST_RESULT);
  },

  clearSession: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TEST_SESSION);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_TEST_ID);
  },
  clear: (): void => {
    StorageService.clearSession();
    StorageService.clearResult();
  },
};

export const TestService = {
  isAnswerCorrect: (question: TestQuestion, userAnswer: number[] | string[]): boolean => {
    const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

    if (question.type === 'matching') {
      const ua = Array.isArray(userAnswer) ? (userAnswer as string[]) : [];
      return ua.length === question.correctAnswers.length && question.correctAnswers.every((c) => ua.includes(c));
    }
    
    if (question.type === 'single' || question.type === 'multiple') {
      const ua = Array.isArray(userAnswer) ? (userAnswer as number[]) : [];
      if (ua.length !== question.correctAnswers.length) return false;
      return question.correctAnswers.every((c) => ua.includes(c));
    }

    if (question.type === 'full_answer') {
      const ua = Array.isArray(userAnswer) ? (userAnswer as string[]) : [];
      const text = ua[0] ? normalize(ua[0]) : '';
      const allowed = question.correctAnswers.map(normalize);
      return text.length > 0 && allowed.includes(text);
    }

    return false;
  },
};

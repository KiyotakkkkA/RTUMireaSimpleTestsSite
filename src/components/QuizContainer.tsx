import React, { useEffect, useMemo, useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { StartScreen } from './StartScreen';
import { Question } from './Question';
import { Results } from './Results';
import { TESTS } from '../tests';
import { TestSelectScreen } from './TestSelectScreen';
import { StorageService } from '../services/storage';
import { SettingsPanel } from './SettingsPanel';
import type { QuizSettings } from '../types/quiz';
import { QuestionNavigator } from './QuestionNavigator';

export const QuizContainer: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [checkGlow, setCheckGlow] = useState<'none' | 'correct' | 'wrong'>('none');

  const selectedTest = useMemo(
    () => (selectedTestId ? TESTS.find((t) => t.id === selectedTestId) ?? null : null),
    [selectedTestId]
  );

  useEffect(() => {
    const savedSession = StorageService.getSession();
    if (savedSession?.quizId) {
      setSelectedTestId(savedSession.quizId);
    }
  }, []);

  const {
    session,
    result,
    startQuiz,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    finishQuiz,
    resetQuiz,
    currentQuestion,
    updateSettings,
    settings,
  } = useQuiz(selectedTestId, selectedTest?.quiz.questions ?? []);

  const effectiveSettings: QuizSettings | null = settings;

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Results result={result} onRetake={resetQuiz} />
      </div>
    );
  }

  if (!selectedTest) {
    return <TestSelectScreen tests={TESTS} onSelect={setSelectedTestId} />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => {
                setSettingsOpen(false);
                resetQuiz();
                setSelectedTestId(null);
              }}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              ← К выбору тестов
            </button>

            <div className="flex-1" />

            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              aria-label="Настройки"
            >
              Настройки
            </button>
          </div>

          <StartScreen
            quizTitle={selectedTest.quiz.discipline_name}
            totalQuestions={selectedTest.quiz.questions.length}
            onStart={() => {
              setSettingsOpen(false);
              startQuiz();
            }}
          />
        </div>

        {effectiveSettings ? (
          <SettingsPanel
            open={settingsOpen}
            settings={effectiveSettings}
            totalQuestions={selectedTest.quiz.questions.length}
            onClose={() => setSettingsOpen(false)}
            onChange={(partial) => updateSettings(partial)}
          />
        ) : null}
      </div>
    );
  }

  if (currentQuestion) {
    const totalQuestions = selectedTest.quiz.questions.length;
    const answeredFlags = selectedTest.quiz.questions.map((q) => {
      const a = session.userAnswers[q.id];
      return Boolean(a && a.length > 0);
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl">
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setSettingsOpen(false);
                setCheckGlow('none');
                resetQuiz();
                setSelectedTestId(null);
              }}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Выход
            </button>
          </div>

          <div className="md:flex md:items-start md:gap-6">
            <div className="mb-6 md:mb-0 md:w-72 md:flex-none">
              <QuestionNavigator
                totalQuestions={totalQuestions}
                currentIndex={session.currentQuestionIndex}
                answered={answeredFlags}
                onNavigate={(index) => {
                  setCheckGlow('none');
                  goToQuestion(index);
                }}
              />
            </div>

            <div className="flex-1">
              <div
                className={
                  `bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-shadow ` +
                  (checkGlow === 'correct'
                    ? 'shadow-emerald-200/60 ring-2 ring-emerald-300'
                    : checkGlow === 'wrong'
                    ? 'shadow-rose-200/60 ring-2 ring-rose-300'
                    : '')
                }
              >
                <Question
                  question={currentQuestion}
                  currentQuestionIndex={session.currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  userAnswer={session.userAnswers[currentQuestion.id]}
                  onAnswerChange={(answer) => saveAnswer(currentQuestion.id, answer)}
                  onNext={nextQuestion}
                  onPrev={prevQuestion}
                  onFinish={finishQuiz}
                  settings={effectiveSettings}
                  onCheckGlowChange={setCheckGlow}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

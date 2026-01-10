import React, { useEffect, useMemo, useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { StartScreen } from './StartScreen';
import { Question } from './Question';
import { Results } from './Results';
import { TESTS } from '../tests';
import { TestSelectScreen } from './TestSelectScreen';
import { StorageService } from '../services/storage';

export const QuizContainer: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

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
    finishQuiz,
    resetQuiz,
    currentQuestion,
  } = useQuiz(selectedTestId, selectedTest?.quiz.questions ?? []);

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
        <StartScreen
          quizTitle={selectedTest.quiz.discipline_name}
          totalQuestions={selectedTest.quiz.questions.length}
          onStart={startQuiz}
        />
      </div>
    );
  }

  if (currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Testix
            </h1>
            <button
              onClick={() => {
                resetQuiz();
                setSelectedTestId(null);
              }}
              className="px-4 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Выход
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <Question
              question={currentQuestion}
              currentQuestionIndex={session.currentQuestionIndex}
              totalQuestions={selectedTest.quiz.questions.length}
              userAnswer={session.userAnswers[currentQuestion.id]}
              onAnswerChange={(answer) => saveAnswer(currentQuestion.id, answer)}
              onNext={nextQuestion}
              onPrev={prevQuestion}
              onFinish={finishQuiz}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

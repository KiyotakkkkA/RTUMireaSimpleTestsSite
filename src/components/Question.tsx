import React from 'react';
import type { QuizQuestion } from '../tests/RBD';
import { SingleChoice } from './SingleChoice';
import { MultipleChoice } from './MultipleChoice';
import { Matching } from './Matching';

interface QuestionProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer: number[] | string[] | undefined;
  onAnswerChange: (answer: number[] | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  onNext,
  onPrev,
  onFinish,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = userAnswer && userAnswer.length > 0;

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Вопрос {currentQuestionIndex + 1} из {totalQuestions}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

        {question.type === 'single' && (
          <SingleChoice
            question={question}
            userAnswer={userAnswer as number[] | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}

        {question.type === 'multiple' && (
          <MultipleChoice
            question={question}
            userAnswer={userAnswer as number[] | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}

        {question.type === 'matching' && (
          <Matching
            question={question}
            userAnswer={userAnswer as string[] | undefined}
            onAnswerChange={onAnswerChange}
          />
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Назад
        </button>

        {isLastQuestion ? (
          <button
            onClick={onFinish}
            disabled={!isAnswered}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Завершить тест
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!isAnswered}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Далее →
          </button>
        )}
      </div>
    </div>
  );
};

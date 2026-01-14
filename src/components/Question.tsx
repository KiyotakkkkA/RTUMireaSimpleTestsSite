import React, { useEffect, useMemo, useState } from 'react';
import type { QuizQuestion } from '../tests/RBD';
import { SingleChoice } from './SingleChoice';
import { MultipleChoice } from './MultipleChoice';
import { Matching } from './Matching';
import { QuizService } from '../services/storage';
import type { QuizSettings } from '../types/quiz';

interface QuestionProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer: number[] | string[] | undefined;
  onAnswerChange: (answer: number[] | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
  settings: QuizSettings | null;
  onCheckGlowChange?: (state: 'none' | 'correct' | 'wrong') => void;
  timeLeftSeconds?: number | null;
}

const BulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8 14a7 7 0 1 1 8 0c-1.2 1-2 2.2-2 3H10c0-.8-.8-2-2-3z" />
  </svg>
);

export const Question: React.FC<QuestionProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  onNext,
  onPrev,
  onFinish,
  settings,
  onCheckGlowChange,
  timeLeftSeconds,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswered = userAnswer && userAnswer.length > 0;

  const [hintActive, setHintActive] = useState(false);
  const [checkedState, setCheckedState] = useState<'none' | 'correct' | 'wrong'>('none');
  const isChecked = checkedState !== 'none';

  const revealCorrect = useMemo(() => {
    return Boolean(hintActive) || Boolean(isChecked);
  }, [hintActive, isChecked]);

  useEffect(() => {
    setHintActive(false);
    setCheckedState('none');
    onCheckGlowChange?.('none');
  }, [question.id, onCheckGlowChange]);

  const showHintButton = Boolean(settings?.hintsEnabled) && !isChecked;
  const isCheckAfterAnswer = Boolean(settings?.checkAfterAnswer);

  const timePill = useMemo(() => {
    if (typeof timeLeftSeconds !== 'number') return null;
    const t = Math.max(0, Math.floor(timeLeftSeconds));
    const m = Math.floor(t / 60);
    const s = t % 60;
    const urgent = t <= 60;
    return (
      <span
        className={
          `inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-semibold ` +
          (urgent
            ? 'border-rose-200 bg-rose-50 text-rose-800'
            : 'border-indigo-200 bg-indigo-50 text-indigo-800')
        }
      >
        Осталось {m}:{s.toString().padStart(2, '0')}
      </span>
    );
  }, [timeLeftSeconds]);

  const handleNext = () => {
    if (!isAnswered) return;

    if (!isLastQuestion && isCheckAfterAnswer) {
      if (!isChecked) {
        const correct = QuizService.isAnswerCorrect(question, userAnswer ?? []);
        const nextState: 'correct' | 'wrong' = correct ? 'correct' : 'wrong';
        setCheckedState(nextState);
        setHintActive(false);
        onCheckGlowChange?.(nextState);
        return;
      }

      setCheckedState('none');
      onCheckGlowChange?.('none');
      onNext();
      return;
    }

    onNext();
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Вопрос {currentQuestionIndex + 1} из {totalQuestions}</span>
          <span className="inline-flex items-center gap-3">
            {timePill}
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </span>
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

        {isChecked ? (
          <div
            className={
              `mb-6 rounded-xl border px-4 py-3 font-semibold ` +
              (checkedState === 'correct'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800')
            }
          >
            {checkedState === 'correct' ? 'Правильно' : 'Неправильно'}
          </div>
        ) : null}

        {question.type === 'single' && (
          <SingleChoice
            question={question}
            userAnswer={userAnswer as number[] | undefined}
            onAnswerChange={onAnswerChange}
            revealCorrect={revealCorrect}
            checkedState={checkedState}
            disabled={isChecked}
          />
        )}

        {question.type === 'multiple' && (
          <MultipleChoice
            question={question}
            userAnswer={userAnswer as number[] | undefined}
            onAnswerChange={onAnswerChange}
            revealCorrect={revealCorrect}
            checkedState={checkedState}
            disabled={isChecked}
          />
        )}

        {question.type === 'matching' && (
          <Matching
            question={question}
            userAnswer={userAnswer as string[] | undefined}
            onAnswerChange={onAnswerChange}
            revealCorrect={revealCorrect}
            checkedState={checkedState}
            disabled={isChecked}
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

        {showHintButton ? (
          <button
            type="button"
            onClick={() => setHintActive((v) => !v)}
            disabled={!isAnswered}
            className={
              `flex-1 px-4 py-3 rounded-lg font-semibold transition-all border ` +
              (hintActive
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50') +
              (!isAnswered ? ' opacity-50 cursor-not-allowed' : '')
            }
            aria-label="Подсказка"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <BulbIcon className="w-5 h-5" />
              Подсказка
            </span>
          </button>
        ) : null}

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
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isCheckAfterAnswer && isChecked ? 'Продолжить' : 'Далее'} →
          </button>
        )}
      </div>
    </div>
  );
};

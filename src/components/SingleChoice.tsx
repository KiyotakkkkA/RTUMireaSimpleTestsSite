import React from 'react';
import type { SingleChoiceQuestion } from '../tests/RBD';

interface SingleChoiceProps {
  question: SingleChoiceQuestion;
  userAnswer: number[] | undefined;
  onAnswerChange: (answer: number[]) => void;
}

export const SingleChoice: React.FC<SingleChoiceProps> = ({
  question,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <label
          key={index}
          className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50"
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={index}
            checked={userAnswer?.includes(index) || false}
            onChange={() => onAnswerChange([index])}
            className="w-5 h-5 text-indigo-600 cursor-pointer"
          />
          <span className="ml-4 text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
};

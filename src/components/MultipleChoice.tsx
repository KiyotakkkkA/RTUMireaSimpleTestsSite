import React from 'react';
import type { MultipleChoiceQuestion } from '../tests/RBD';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  userAnswer: number[] | undefined;
  onAnswerChange: (answer: number[]) => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  userAnswer = [],
  onAnswerChange,
}) => {
  const toggleOption = (index: number) => {
    const newAnswer = userAnswer.includes(index)
      ? userAnswer.filter((i) => i !== index)
      : [...userAnswer, index];
    onAnswerChange(newAnswer);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">Выберите все правильные ответы</p>
      {question.options.map((option, index) => (
        <label
          key={index}
          className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50"
        >
          <input
            type="checkbox"
            value={index}
            checked={userAnswer.includes(index)}
            onChange={() => toggleOption(index)}
            className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
          />
          <span className="ml-4 text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );
};

import React from 'react';
import type { MatchingQuestion } from '../tests/RBD';

interface MatchingProps {
  question: MatchingQuestion;
  userAnswer: string[] | undefined;
  onAnswerChange: (answer: string[]) => void;
}

export const Matching: React.FC<MatchingProps> = ({
  question,
  userAnswer = [],
  onAnswerChange,
}) => {
  const handleMatchChange = (term: string, meaningIndex: number) => {
    const matchString = `${term}${meaningIndex}`;
    const newAnswer = userAnswer.filter((pair) => !pair.startsWith(term));
    newAnswer.push(matchString);
    onAnswerChange(newAnswer);
  };

  const getSelectedMeaning = (term: string): number | null => {
    const match = userAnswer.find((pair) => pair.startsWith(term));
    return match ? parseInt(match.substring(1)) : null;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">Установите соответствие между терминами и определениями</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Термины</h4>
          <div className="space-y-2">
            {Object.entries(question.terms).map(([key, term]) => (
              <div key={key} className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="font-medium text-blue-900">{key}</p>
                <p className="text-sm text-blue-700">{term}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Определения</h4>
          <div className="space-y-3">
            {Object.entries(question.meanings).map(([index, meaning]) => {
              const selectedTerm = Object.keys(question.terms).find(
                (term) => getSelectedMeaning(term) === parseInt(index)
              );

              return (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 mb-2">{meaning}</p>
                  <select
                    value={selectedTerm || ''}
                    onChange={(e) => handleMatchChange(e.target.value, parseInt(index))}
                    className="w-full px-3 py-2 border border-green-300 rounded bg-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Выберите термин...</option>
                    {Object.keys(question.terms).map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

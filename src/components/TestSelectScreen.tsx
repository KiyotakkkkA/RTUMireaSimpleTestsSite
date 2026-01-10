import React from 'react';
import type { TestEntry } from '../tests';

interface TestSelectScreenProps {
  tests: TestEntry[];
  onSelect: (testId: string) => void;
}

export const TestSelectScreen: React.FC<TestSelectScreenProps> = ({ tests, onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Testix
          </h1>
          <p className="text-gray-600 mt-2">Выберите тест для прохождения</p>
        </div>

        <div className="grid gap-4">
          {tests.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className="text-left bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    {t.quiz.discipline_name}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {t.quiz.questions.length} вопросов
                  </div>
                </div>
                <div className="shrink-0 text-indigo-600 font-semibold">Выбрать →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface StartScreenProps {
  quizTitle: string;
  totalQuestions: number;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  quizTitle,
  totalQuestions,
  onStart,
}) => {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Testix
          </h1>
          <p className="text-gray-600 text-lg">Платформа для прохождения тестов</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{quizTitle}</h2>
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 1 1 0 000 2H6a6 6 0 016 6v3a2 2 0 11-4 0v-3a2 2 0 00-4 0v5a2 2 0 104 0 1 1 0 000 2 4 4 0 01-4-4v-7a1 1 0 000-2 1 1 0 00-1 1v7a4 4 0 004 4 6 6 0 006-6 4 4 0 00-4-4H8a1 1 0 100 2h.5a2 2 0 012 2v3a1 1 0 11-2 0v-3a2 2 0 00-2-2H6a1 1 0 000 2h2v5a4 4 0 01-4-4v-7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg font-semibold">{totalQuestions} вопросов</span>
          </div>
        </div>

        <div className="space-y-3 text-left bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800">Как это работает:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center">
                1
              </span>
              <span>Вам будут предложены вопросы разных типов</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center">
                2
              </span>
              <span>Вы можете перемещаться между вопросами</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center">
                3
              </span>
              <span>После завершения увидите результат и оценку</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Начать тест
        </button>
      </div>
    </div>
  );
};

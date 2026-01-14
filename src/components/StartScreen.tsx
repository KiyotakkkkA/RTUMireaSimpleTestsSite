import React from 'react';

interface StartScreenProps {
  quizTitle: string;
  totalQuestions: number;
  onStart: () => void;
  onOpenExpress: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  quizTitle,
  totalQuestions,
  onStart,
  onOpenExpress,
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

        <button
          onClick={onOpenExpress}
          className="w-full py-3.5 bg-white text-indigo-700 font-bold rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
        >
          Сгенерировать экспресс-тест
        </button>
      </div>
    </div>
  );
};

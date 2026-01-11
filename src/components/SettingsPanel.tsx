import React, { useMemo } from 'react';
import type { QuizSettings } from '../types/quiz';

interface SettingsPanelProps {
  open: boolean;
  settings: QuizSettings;
  totalQuestions: number;
  onClose: () => void;
  onChange: (partial: Partial<QuizSettings>) => void;
}

const SwitchRow: React.FC<{
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ title, description, checked, onChange }) => {
  const id = useMemo(() => `sw-${Math.random().toString(16).slice(2)}`, []);

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block font-semibold text-gray-800">
          {title}
        </label>
        {description ? <p className="text-sm text-gray-600 mt-1">{description}</p> : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          `relative inline-flex h-7 w-12 flex-none items-center rounded-full transition-colors ` +
          (checked ? 'bg-indigo-600' : 'bg-gray-300')
        }
      >
        <span
          className={
            `inline-block h-5 w-5 transform rounded-full bg-white transition-transform ` +
            (checked ? 'translate-x-6' : 'translate-x-1')
          }
        />
        <span className="sr-only">{title}</span>
      </button>
    </div>
  );
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  settings,
  totalQuestions,
  onClose,
  onChange,
}) => {
  return (
    <>
      <div
        className={
          `fixed inset-0 z-40 bg-black/20 transition-opacity ` +
          (open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
        }
        onClick={onClose}
      />

      <div
        className={
          `fixed top-0 right-0 z-50 h-full w-[360px] max-w-[90vw] bg-white shadow-2xl ` +
          `transition-transform duration-300 ease-in-out ` +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
        role="dialog"
        aria-modal="true"
        aria-label="Настройки"
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Настройки
            </h2>
            <button
              onClick={onClose}
              className="px-3 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Закрыть
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto">
            <div className="py-4">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">Порог прохода</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Минимум правильных ответов
                  </div>
                </div>
                <div className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1">
                  {settings.passThreshold} / {totalQuestions}
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={Math.max(1, totalQuestions)}
                step={1}
                value={Math.min(Math.max(1, settings.passThreshold), Math.max(1, totalQuestions))}
                onChange={(e) => onChange({ passThreshold: Number(e.target.value) })}
                className="mt-4 w-full accent-indigo-600"
              />
            </div>

            <div className="border-t border-gray-200" />

            <SwitchRow
              title="Включить подсказки во время теста"
              description="Показывает дополнительную кнопку, подсвечивающую правильные ответы"
              checked={settings.hintsEnabled}
              onChange={(checked) => onChange({ hintsEnabled: checked })}
            />

            <div className="border-t border-gray-200" />

            <SwitchRow
              title="Проверять вопрос после ответа"
              description="После нажатия 'Далее' выполняется автопроверка"
              checked={settings.checkAfterAnswer}
              onChange={(checked) => onChange({ checkAfterAnswer: checked })}
            />

            <div className="border-t border-gray-200" />

            <SwitchRow
              title="Отображать неправильные ответы в конце теста"
              description="Показывает вопросы, где были допущены ошибки и правильные ответы"
              checked={settings.showIncorrectAtEnd}
              onChange={(checked) => onChange({ showIncorrectAtEnd: checked })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

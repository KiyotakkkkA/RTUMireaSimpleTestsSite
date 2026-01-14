import React, { useEffect, useMemo, useState } from 'react';

export interface ExpressTestConfig {
  timeLimitEnabled: boolean;
  timeLimitMinutes: number;
  questionCount: number;
  passThreshold: number;
}

interface ExpressTestModalProps {
  open: boolean;
  totalQuestions: number;
  onClose: () => void;
  onStart: (config: ExpressTestConfig) => void;
}

const clampInt = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
};

export const ExpressTestModal: React.FC<ExpressTestModalProps> = ({
  open,
  totalQuestions,
  onClose,
  onStart,
}) => {
  const total = Math.max(1, totalQuestions);

  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [questionCount, setQuestionCount] = useState(Math.min(20, total));
  const [passThreshold, setPassThreshold] = useState(
    Math.min(Math.min(20, total), Math.ceil(Math.min(20, total) * 0.85))
  );

  useEffect(() => {
    if (!open) return;
    const qc = Math.min(20, total);
    setQuestionCount(qc);
    setPassThreshold(Math.min(qc, Math.ceil(qc * 0.85)));
    setTimeLimitEnabled(false);
    setTimeLimitMinutes(20);
  }, [open, total]);

  useEffect(() => {
    setPassThreshold((prev) => clampInt(prev, 1, Math.max(1, questionCount)));
  }, [questionCount]);

  const canStart = useMemo(() => {
    if (questionCount < 1 || questionCount > total) return false;
    if (passThreshold < 1 || passThreshold > questionCount) return false;
    if (timeLimitEnabled && (timeLimitMinutes < 1 || timeLimitMinutes > 999)) return false;
    return true;
  }, [passThreshold, questionCount, timeLimitEnabled, timeLimitMinutes, total]);

  return (
    <>
      <div
        className={
          `fixed inset-0 z-40 bg-black/30 transition-opacity ` +
          (open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
        }
        onClick={onClose}
      />

      <div
        className={
          `fixed left-1/2 top-1/2 z-50 w-[640px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 ` +
          `transition-all duration-200 ` +
          (open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none')
        }
        role="dialog"
        aria-modal="true"
        aria-label="Экспресс-тест"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Экспресс-тест
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Случайные вопросы из выбранного теста. Подсказки и автопроверка отключены, а неправильные ответы всегда показываются.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-2 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Закрыть
            </button>
          </div>

          <div className="px-6 py-5 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="font-semibold text-gray-800">Ограничение по времени</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeLimitEnabled(false)}
                  className={
                    `rounded-xl border px-4 py-3 text-left transition-colors ` +
                    (!timeLimitEnabled
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50')
                  }
                >
                  <div className="font-semibold text-gray-900">Нет</div>
                  <div className="text-sm text-gray-600 mt-1">Без таймера</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeLimitEnabled(true)}
                  className={
                    `rounded-xl border px-4 py-3 text-left transition-colors ` +
                    (timeLimitEnabled
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50')
                  }
                >
                  <div className="font-semibold text-gray-900">Да</div>
                  <div className="text-sm text-gray-600 mt-1">Завершится автоматически</div>
                </button>
              </div>

              {timeLimitEnabled ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-800">
                    Сколько минут?
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(clampInt(Number(e.target.value), 1, 999))}
                      className="w-32 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <span className="text-sm text-gray-600">мин.</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">Количество вопросов</div>
                  <div className="text-sm text-gray-600 mt-1">Случайные вопросы из теста</div>
                </div>
                <div className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1">
                  {questionCount} / {total}
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={total}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(clampInt(Number(e.target.value), 1, total))}
                className="mt-4 w-full accent-indigo-600"
              />
            </div>

            <div className="border-t border-gray-200" />

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">Порог прохода</div>
                  <div className="text-sm text-gray-600 mt-1">Минимум правильных ответов</div>
                </div>
                <div className="text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1">
                  {passThreshold} / {questionCount}
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={Math.max(1, questionCount)}
                step={1}
                value={clampInt(passThreshold, 1, Math.max(1, questionCount))}
                onChange={(e) => setPassThreshold(clampInt(Number(e.target.value), 1, Math.max(1, questionCount)))}
                className="mt-4 w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="px-6 py-5 border-t border-gray-200 bg-white flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              disabled={!canStart}
              onClick={() =>
                onStart({
                  timeLimitEnabled,
                  timeLimitMinutes: clampInt(timeLimitMinutes, 1, 999),
                  questionCount: clampInt(questionCount, 1, total),
                  passThreshold: clampInt(passThreshold, 1, Math.max(1, questionCount)),
                })
              }
              className={
                `px-5 py-3 rounded-xl font-bold text-white transition-all ` +
                (canStart
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed')
              }
            >
              Сгенерировать и начать
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

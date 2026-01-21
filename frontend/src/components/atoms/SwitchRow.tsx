import { useMemo } from "react";

interface SwitchRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SwitchRow = ({ title, description, checked, onChange }: SwitchRowProps) => {
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
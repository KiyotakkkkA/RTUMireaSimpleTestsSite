interface InputCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    title?: string;
}

export const InputCheckbox = ({
    checked,
    onChange,
    title,
}: InputCheckboxProps) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={
                `relative inline-flex h-7 w-12 flex-none items-center rounded-full transition-colors ` +
                (checked ? "bg-indigo-600" : "bg-slate-300")
            }
        >
            <span
                className={
                    `inline-block h-5 w-5 transform rounded-full bg-slate-50 transition-transform ` +
                    (checked ? "translate-x-6" : "translate-x-1")
                }
            />
            <span className="sr-only">{title}</span>
        </button>
    );
};

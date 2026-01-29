import type React from "react";
import { useId } from "react";

export interface InputSmallProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const InputBig = ({
    className,
    id,
    disabled,
    ...props
}: InputSmallProps) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    const behaviorClasses =
        "transition-colors duration-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100";

    return (
        <textarea
            id={inputId}
            disabled={disabled}
            className={`w-full rounded-lg border ${behaviorClasses} text-slate-700 placeholder:text-slate-400 focus:border-indigo-600 hover:border-indigo-400 ${
                className ?? ""
            }`}
            {...props}
        />
    );
};

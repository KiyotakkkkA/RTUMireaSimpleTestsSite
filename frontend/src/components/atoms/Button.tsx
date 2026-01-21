import type React from "react";
import { Link } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    to?: string;
    onClick?: () => void;

    primary?: boolean;
    primaryNoBackground?: boolean;
    disabled?: boolean;
    secondary?: boolean;
    secondaryNoBorder?: boolean;
    success?: boolean;
    warning?: boolean;
    danger?: boolean;
}

export const Button = ({
    to,
    onClick,
    children,
    className,
    type = "button",
    disabled = false,
    primary = false,
    primaryNoBackground = false,
    secondary = false,
    secondaryNoBorder = false,
    success = false,
    warning = false,
    danger = false,
    ...props
}: ButtonProps) => {

    let buttonClasses = `transition-colors duration-300 rounded-lg`;
    if (primary) buttonClasses += ' bg-indigo-500 text-white hover:bg-indigo-600';
    if (primaryNoBackground) buttonClasses += ' text-gray-600 hover:text-indigo-600';
    if (secondary) buttonClasses += ' border border-indigo-500/50 text-indigo-500 hover:bg-indigo-500 hover:text-white';
    if (secondaryNoBorder) buttonClasses += ' text-indigo-500 hover:bg-indigo-500 hover:text-white';
    if (success) buttonClasses += ' bg-green-500 text-white hover:bg-green-600';
    if (warning) buttonClasses += ' bg-yellow-500 text-white hover:bg-yellow-600';
    if (danger) buttonClasses += ' bg-red-500 text-white hover:bg-red-600';
    if (disabled) buttonClasses += ' opacity-50 cursor-not-allowed pointer-events-none';

    const combinedClassName = (className ? className + ' ' : '') + buttonClasses;

    if (to) {
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            if (disabled) {
                event.preventDefault();
                return;
            }
            onClick?.();
        };

        return (
            <Link to={to} onClick={handleClick} className={combinedClassName} aria-disabled={disabled}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClassName} disabled={disabled} type={type} {...props}>
            {children}
        </button>
    );
};
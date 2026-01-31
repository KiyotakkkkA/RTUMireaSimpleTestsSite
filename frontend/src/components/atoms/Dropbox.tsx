import type React from "react";
import { useEffect, useMemo, useRef } from "react";

type DropboxAlign = "left" | "right";

type DropboxProps = React.HTMLAttributes<HTMLDivElement> & {
    open: boolean;
    align?: DropboxAlign;
    closeOnOutsideClick?: boolean;
    onClose?: () => void;
};

export const Dropbox = ({
    open,
    align = "right",
    closeOnOutsideClick = true,
    onClose,
    className,
    children,
    ...props
}: DropboxProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !closeOnOutsideClick) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current) return;
            if (ref.current.contains(event.target as Node)) return;
            onClose?.();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open, closeOnOutsideClick, onClose]);

    const alignClass = useMemo(
        () =>
            align === "left"
                ? "left-0 origin-top-left"
                : "right-0 origin-top-right",
        [align],
    );

    return (
        <div
            ref={ref}
            className={`absolute bg-slate-50 z-30 mt-2 ${alignClass} transition-all duration-200 ${
                open
                    ? "opacity-100 translate-y-0 scale-100"
                    : "pointer-events-none opacity-0 -translate-y-1 scale-95"
            } ${className ?? ""}`}
            {...props}
        >
            {children}
        </div>
    );
};

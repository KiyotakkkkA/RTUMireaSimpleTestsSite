import type React from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

interface ModalProps {
    open: boolean;
    title?: string | React.ReactNode;
    onClose: () => void;
    children: React.ReactNode;
    outsideClickClosing?: boolean;
}

const Modal = ({ open, title, onClose, children, outsideClickClosing = false }: ModalProps) => {
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className={`fixed inset-0 z-40 flex items-center justify-center px-4 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!open}
        >
            <div
                className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
                onClick={outsideClickClosing ? onClose : undefined}
            />
            <div
                role="dialog"
                aria-modal="true"
                className={`relative w-full max-w-lg rounded-lg bg-white shadow-2xl transition-all duration-300 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
            >
                <div className="flex items-center justify-end p-4 border-b border-gray-200">
                    <div className={`flex ${title ? "justify-between" : "justify-end"} items-start w-full`}>
                        { title }
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Закрыть окно"
                        >
                            <Icon icon="mdi:close" className="h-7 w-7" />
                        </button>
                    </div>
                </div>
                <div className="py-2 px-4">{children}</div>
            </div>
        </div>,
        document.body
    );
};

export { Modal };

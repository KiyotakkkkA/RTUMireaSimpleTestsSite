import { useId, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import type React from "react";

export interface InputMediaProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "value"
> {
    label?: string;
    helperText?: string;
    value?: File[];
    existingFiles?: {
        id: number;
        name: string;
        url: string;
        mime_type?: string | null;
        size?: number | null;
    }[];
    onChange?: (files: File[]) => void;
    onRemoveExisting?: (file: { id: number; name: string }) => void;
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
};

export const InputMedia = ({
    label,
    helperText,
    value,
    existingFiles = [],
    onChange,
    onRemoveExisting,
    className,
    disabled,
    id,
    multiple = true,
    accept,
    ...props
}: InputMediaProps) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [internalFiles, setInternalFiles] = useState<File[]>([]);

    const files = value ?? internalFiles;

    const acceptLabel = useMemo(() => {
        if (!accept) return "Любые файлы";
        return accept
            .split(",")
            .map((item) => item.trim())
            .join(", ");
    }, [accept]);

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files ?? []);
        if (!value) {
            setInternalFiles(selected);
        }
        onChange?.(selected);
        event.target.value = "";
    };

    const handleRemoveFile = (fileToRemove: File) => {
        const nextFiles = files.filter(
            (file) =>
                !(
                    file.name === fileToRemove.name &&
                    file.lastModified === fileToRemove.lastModified
                ),
        );
        if (!value) {
            setInternalFiles(nextFiles);
        }
        onChange?.(nextFiles);
    };

    const previewItems = useMemo(() => {
        return files.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file),
            mime_type: file.type,
            kind: "new" as const,
            file,
        }));
    }, [files]);

    return (
        <div className={`w-full ${className ?? ""}`}>
            {label && (
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                </div>
            )}
            <label
                htmlFor={inputId}
                className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-300 bg-slate-50/70 px-4 py-6 text-center text-sm text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 ${
                    disabled ? "cursor-not-allowed opacity-60" : ""
                }`}
            >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50">
                    <Icon icon="mdi:plus" className="h-6 w-6" />
                </span>
                <div className="font-semibold">Прикрепить файл</div>
                <div className="text-xs text-indigo-400">
                    Поддерживаемые типы: {acceptLabel}
                </div>
                {helperText && (
                    <div className="text-xs text-slate-400">{helperText}</div>
                )}
            </label>
            <input
                id={inputId}
                type="file"
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                onChange={handleFilesChange}
                className="hidden"
                {...props}
            />

            {(files.length > 0 || existingFiles.length > 0) && (
                <div className="mt-3 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {existingFiles.map((file) => (
                            <div
                                key={`existing-${file.id}`}
                                className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                            >
                                <div className="aspect-video w-full bg-slate-100">
                                    {file.mime_type?.startsWith("image/") ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <Icon
                                                icon="mdi:file-outline"
                                                className="h-8 w-8"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-500">
                                    <span className="truncate text-slate-700">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveExisting?.({
                                                id: file.id,
                                                name: file.name,
                                            })
                                        }
                                        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                                        aria-label={`Удалить файл ${file.name}`}
                                    >
                                        <Icon
                                            icon="mdi:close"
                                            className="h-4 w-4"
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {previewItems.map((file) => (
                            <div
                                key={`new-${file.id}`}
                                className="relative overflow-hidden rounded-lg border border-indigo-100 bg-indigo-50"
                            >
                                <div className="aspect-video w-full bg-slate-100">
                                    {file.mime_type?.startsWith("image/") ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-indigo-300">
                                            <Icon
                                                icon="mdi:file-outline"
                                                className="h-8 w-8"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-500">
                                    <span className="truncate text-slate-700">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFile(file.file)
                                        }
                                        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                                        aria-label={`Удалить файл ${file.name}`}
                                    >
                                        <Icon
                                            icon="mdi:close"
                                            className="h-4 w-4"
                                        />
                                    </button>
                                </div>
                                <div className="px-3 pb-2 text-xs text-slate-400">
                                    {formatFileSize(file.size)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

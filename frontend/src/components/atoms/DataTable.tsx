import type React from "react";

export type DataTableAlignment = "left" | "center" | "right";

export type DataTableColumn = {
    key: string;
    label: React.ReactNode;
    align?: DataTableAlignment;
    className?: string;
};

export type DataTableRow = {
    key: string;
    cells: React.ReactNode[];
};

interface DataTableProps {
    columns: DataTableColumn[];
    rows: DataTableRow[];
    emptyState?: React.ReactNode;
    className?: string;
    onRowClick?: (rowKey: string) => void;
}

const alignmentClass: Record<DataTableAlignment, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export const DataTable = ({
    columns,
    rows,
    emptyState,
    className,
    onRowClick,
}: DataTableProps) => {
    if (!rows.length) {
        return (
            <div className={className}>
                {emptyState ?? (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        Нет данных для отображения.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`${className ?? ""}`}>
            <div
                className={`grid gap-3 rounded-t-lg border border-slate-100 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400`}
                style={{
                    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
            >
                {columns.map((column) => (
                    <div
                        key={column.key}
                        className={`${alignmentClass[column.align ?? "left"]} ${column.className ?? ""}`}
                    >
                        {column.label}
                    </div>
                ))}
            </div>
            {rows.map((row) => (
                <div
                    key={row.key}
                    onClick={() => onRowClick?.(row.key)}
                    className={`grid items-center gap-3 px-4 py-3 text-sm bg-slate-100 text-slate-600 last:rounded-b-lg hover:bg-indigo-100 even:bg-slate-300/50 ${onRowClick ? "cursor-pointer" : ""}`}
                    style={{
                        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                    }}
                >
                    {row.cells.map((cell, index) => {
                        const column = columns[index];
                        return (
                            <div
                                key={`${row.key}-${column?.key ?? index}`}
                                className={`${alignmentClass[column?.align ?? "left"]} ${column?.className ?? ""}`}
                            >
                                {cell}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

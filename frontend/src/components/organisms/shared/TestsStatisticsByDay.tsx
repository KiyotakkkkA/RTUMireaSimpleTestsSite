import type {
    StatisticsDayTest,
    StatisticsSummary,
} from "../../../types/shared/TestsStatistics";
import { DataTable } from "../../atoms";
import type { DataTableColumn, DataTableRow } from "../../atoms/DataTable";

type StatisticsBlocks =
    | "totalStats"
    | "averagePercentage"
    | "uniqueTests"
    | "averageTime";

export type TestsStatisticsByDayProps = {
    summary: StatisticsSummary;
    tests: StatisticsDayTest[];
    blocks?: Record<StatisticsBlocks, boolean>;
    title?: string;
    subtitle?: string;
    totalLabel?: string;
};

export const TestsStatisticsByDay = ({
    summary,
    tests,
    title = "Статистика по дню",
    subtitle = "Детализация по тестам за выбранный день.",
    totalLabel = "Всего прохождений",
    blocks = {
        totalStats: true,
        averagePercentage: true,
        averageTime: true,
        uniqueTests: true,
    },
}: TestsStatisticsByDayProps) => {
    const columns: DataTableColumn[] = [
        { key: "title", label: "Тест" },
        { key: "total", label: "Прохождений", align: "right" as const },
        ...(blocks.averagePercentage
            ? [
                  {
                      key: "avg_percentage",
                      label: "Средний процент",
                      align: "right" as const,
                  },
              ]
            : []),
        ...(blocks.averageTime
            ? [
                  {
                      key: "avg_time",
                      label: "Среднее время",
                      align: "right" as const,
                  },
              ]
            : []),
    ];
    const rows: DataTableRow[] = tests.map((test) => ({
        key: test.id,
        cells: [
            <div key="title" className="truncate font-medium text-slate-800">
                {test.title}
            </div>,
            <div key="total" className="font-semibold text-slate-700">
                {test.total}
            </div>,
            ...(blocks.averagePercentage
                ? [
                      <div
                          key="avg_percentage"
                          className="font-semibold text-slate-700"
                      >
                          {test.avg_percentage}%
                      </div>,
                  ]
                : []),
            ...(blocks.averageTime
                ? [
                      <div
                          key="avg_time"
                          className="font-semibold text-slate-700"
                      >
                          {test.avg_time ?? "—"}
                      </div>,
                  ]
                : []),
        ],
    }));

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-lg font-semibold text-slate-800">
                        {title}
                    </div>
                    <div className="text-sm text-slate-500">{subtitle}</div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {blocks.totalStats && (
                    <div className="rounded-lg border border-slate-100 bg-slate-100 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {totalLabel}
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-800">
                            {summary.total_completions}
                        </div>
                    </div>
                )}
                {blocks.averagePercentage && (
                    <div className="rounded-lg border border-slate-100 bg-slate-100 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Средний процент
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-800">
                            {summary.average_percentage}%
                        </div>
                    </div>
                )}
                {blocks.uniqueTests && (
                    <div className="rounded-lg border border-slate-100 bg-slate-100 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Различных тестов пройдено
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-slate-800">
                            {summary.unique_tests}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <DataTable
                    columns={columns}
                    rows={rows}
                    onRowClick={(value) => {
                        console.log(value);
                    }}
                />
            </div>
        </div>
    );
};

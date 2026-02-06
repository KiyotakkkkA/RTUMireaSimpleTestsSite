export type StatisticsFilters = {
    date_from?: string;
    date_to?: string;
    min_percentage?: number | "";
};

export type StatisticsTestBreakdown = {
    id: string;
    title: string;
    total: number;
};

export type StatisticsDay = {
    date: string;
    total: number;
    avg_percentage: number;
    tests: StatisticsTestBreakdown[];
};

export type StatisticsSummary = {
    total_completions: number;
    average_percentage: number;
    unique_tests: number;
};

export type StatisticsDayFilters = {
    date: string;
    time_from?: string;
    time_to?: string;
    min_percentage?: number | "";
};

export type StatisticsDayTest = {
    id: string;
    title: string;
    total: number;
    avg_percentage: number;
    avg_time: string | null;
};

export type StatisticsDayBlock = {
    summary: StatisticsSummary;
    tests: StatisticsDayTest[];
};

export type StatisticsDayResponse = {
    date: string;
    finished: StatisticsDayBlock;
    started: StatisticsDayBlock;
};

export type StatisticsBlock = {
    summary: StatisticsSummary;
    series: StatisticsDay[];
};

export type StatisticsResponse = {
    finished: StatisticsBlock;
    started: StatisticsBlock;
};

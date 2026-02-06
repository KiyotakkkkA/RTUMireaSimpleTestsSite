<?php

namespace App\Services\Reports;

use App\Services\Shared\TestsStatisticsService;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportExcelService
{
    private TestsStatisticsService $testsStatisticsService;

    public function __construct(TestsStatisticsService $testsStatisticsService)
    {
        $this->testsStatisticsService = $testsStatisticsService;
    }

    public function makeStatisticsToExcel(array $filters): StreamedResponse
    {
        $data = $this->testsStatisticsService->getGeneralStatistics($filters);
        $spreadsheet = new Spreadsheet();

        $this->fillGeneralSheet($spreadsheet->getActiveSheet(), 'Завершено', $data['finished']);
        $startedSheet = $spreadsheet->createSheet();
        $this->fillGeneralSheet($startedSheet, 'Начато', $data['started']);

        return $this->streamSpreadsheet($spreadsheet, 'statistics');
    }

    public function makeStatisticsDayToExcel(string $date, array $filters): StreamedResponse
    {
        $data = $this->testsStatisticsService->getDayStatistics($date, $filters);
        $spreadsheet = new Spreadsheet();

        $this->fillDaySheet($spreadsheet->getActiveSheet(), 'Завершено', $data['finished']);
        $startedSheet = $spreadsheet->createSheet();
        $this->fillDaySheet($startedSheet, 'Начато', $data['started']);

        return $this->streamSpreadsheet($spreadsheet, "statistics-day-{$date}");
    }

    private function fillGeneralSheet($sheet, string $title, array $block): void
    {
        $sheet->setTitle($title);
        $sheet->fromArray([
            ['Дата', 'Прохождений', 'Средний процент', 'Тесты'],
        ], null, 'A1');

        $row = 2;
        foreach ($block['series'] as $item) {
            $testsLabel = collect($item['tests'] ?? [])
                ->map(fn ($test) => "{$test['title']} ({$test['total']})")
                ->implode('; ');

            $sheet->fromArray([
                [
                    $item['date'],
                    $item['total'],
                    $item['avg_percentage'],
                    $testsLabel,
                ],
            ], null, "A{$row}");
            $row++;
        }

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);
    }

    private function fillDaySheet($sheet, string $title, array $block): void
    {
        $sheet->setTitle($title);
        $sheet->fromArray([
            ['Тест', 'Прохождений', 'Средний процент', 'Среднее время'],
        ], null, 'A1');

        $row = 2;
        foreach ($block['tests'] as $item) {
            $sheet->fromArray([
                [
                    $item['title'],
                    $item['total'],
                    $item['avg_percentage'],
                    $item['avg_time'] ?? '-',
                ],
            ], null, "A{$row}");
            $row++;
        }

        $sheet->getColumnDimension('A')->setAutoSize(true);
        $sheet->getColumnDimension('B')->setAutoSize(true);
        $sheet->getColumnDimension('C')->setAutoSize(true);
        $sheet->getColumnDimension('D')->setAutoSize(true);
    }

    private function streamSpreadsheet(Spreadsheet $spreadsheet, string $baseName): StreamedResponse
    {
        $writer = new Xlsx($spreadsheet);
        $timestamp = now()->format('Ymd-His');
        $fileName = "{$baseName}-{$timestamp}.xlsx";

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}

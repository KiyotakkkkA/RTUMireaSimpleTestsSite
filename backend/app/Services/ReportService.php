<?php

namespace App\Services;

use App\Models\Test\Test;
use App\Services\Reports\ReportExcelService;
use App\Services\Reports\ReportPDFService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportService
{
    protected ReportPDFService $pdfService;
    protected ReportExcelService $excelService;

    public function __construct(
        ReportPDFService $pdfService,
        ReportExcelService $excelService,
    ) {
        $this->pdfService = $pdfService;
        $this->excelService = $excelService;
    }

    public function makeTestToPDF(string $testId)
    {
        return $this->pdfService->makeTestToPDF($testId);
    }

    public function makeTestToJSON(string $testId)
    {
        $test = Test::with('questions')->findOrFail($testId);
        $alphabet = range('A', 'Z');

        $questions = $test->questions->values()->map(function ($question) use ($alphabet) {
            $options = $question->options ?? [];

            if ($question->type === 'single' || $question->type === 'multiple') {
                return [
                    'question' => $question->title,
                    'type' => $question->type,
                    'options' => array_values($options['options'] ?? []),
                    'correctAnswers' => array_map('intval', array_values($options['correctOptions'] ?? [])),
                ];
            }

            if ($question->type === 'matching') {
                $terms = array_values($options['terms'] ?? []);
                $meanings = array_values($options['meanings'] ?? []);
                $matches = array_values($options['matches'] ?? []);

                $termsMap = [];
                foreach ($terms as $idx => $term) {
                    $key = $alphabet[$idx] ?? (string) ($idx + 1);
                    $termsMap[$key] = $term;
                }

                $meaningsMap = [];
                foreach ($meanings as $idx => $meaning) {
                    $meaningsMap[(string) $idx] = $meaning;
                }

                $correctAnswers = [];
                foreach ($meanings as $idx => $meaning) {
                    $termKey = $matches[$idx] ?? '';
                    if (!$termKey) {
                        continue;
                    }
                    $correctAnswers[] = $termKey . $idx;
                }

                return [
                    'question' => $question->title,
                    'type' => $question->type,
                    'terms' => $termsMap,
                    'meanings' => $meaningsMap,
                    'correctAnswers' => $correctAnswers,
                ];
            }

            return [
                'question' => $question->title,
                'type' => $question->type,
                'correctAnswers' => array_values($options['answers'] ?? []),
            ];
        })->all();

        $payload = [
            'questions' => $questions,
        ];

        return $payload;
    }

    public function makeAuditToPDF(array $filters)
    {
        return $this->pdfService->makeAuditToPDF($filters);
    }

    public function makeStatisticsToExcel(array $filters): StreamedResponse
    {
        return $this->excelService->makeStatisticsToExcel($filters);
    }

    public function makeStatisticsDayToExcel(string $date, array $filters): StreamedResponse
    {
        return $this->excelService->makeStatisticsDayToExcel($date, $filters);
    }
}

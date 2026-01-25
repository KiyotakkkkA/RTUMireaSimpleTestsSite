<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Symfony\Component\HttpFoundation\Response;

class ReportsController extends Controller
{
    private ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function makeTestToPDF(string $testId): Response
    {
        $payload = $this->reportService->makeTestToPDF($testId);

        return $payload->download("test-{$testId}.pdf");
    }

    public function makeTestToJSON(string $testId): Response
    {
        $payload = $this->reportService->makeTestToJSON($testId);

        return response()->json(
            $payload,
            200,
            [
                'Content-Disposition' => "attachment; filename=\"test-{$testId}.json\"",
                'Content-Type' => 'application/json; charset=utf-8',
            ],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
    }
}

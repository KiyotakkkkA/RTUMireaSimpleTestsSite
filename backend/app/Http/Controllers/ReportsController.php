<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuditIndexRequest;
use App\Models\Test\Test;
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
        $test = Test::findOrFail($testId);
        $this->authorize('export', $test);

        $payload = $this->reportService->makeTestToPDF($testId);

        return $payload->download("test-{$testId}.pdf");
    }

    public function makeTestToJSON(string $testId): Response
    {
        $test = Test::findOrFail($testId);
        $this->authorize('export', $test);

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

    public function makeAuditToPDF(AuditIndexRequest $request): Response
    {
        $validated = $request->validated();

        $payload = $this->reportService->makeAuditToPDF($validated);

        $timestamp = now()->format('Ymd-His');

        return $payload->download("audit-{$timestamp}.pdf");
    }
}

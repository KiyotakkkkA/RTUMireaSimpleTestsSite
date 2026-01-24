<?php

namespace App\Services;

use App\Repositories\TestsRepository;
use App\Models\Test\Test;
use Illuminate\Support\Facades\Storage;

class TestsService
{
    protected TestsRepository $testsRepository;
    protected AuditService $auditService;

    public function __construct(TestsRepository $testsRepository, AuditService $auditService)
    {
        $this->testsRepository = $testsRepository;
        $this->auditService = $auditService;
    }

    public function createBlankTest(array $data)
    {
        $test = $this->testsRepository->createBlankTest($data);
        $this->auditService->auditTestCreated(auth()->user(), $this->mapTestSnapshot($test));

        return $test;
    }

    public function getTestById(string $testId): ?Test
    {
        return $this->testsRepository->getTestById($testId);
    }

    public function listTests(string $sortBy = 'title', string $sortDir = 'asc', int $perPage = 10, int $page = 1)
    {
        return $this->testsRepository->listTests($sortBy, $sortDir, $perPage, $page);
    }

    public function updateTest(string $testId, array $payload): array
    {
        [$test, $changedQuestions, $hasChanges] = $this->testsRepository->updateTest($testId, $payload);

        if ($hasChanges) {
            $this->auditService->auditTestUpdated(auth()->user(), $this->mapTestSnapshot($test), $changedQuestions);
        }

        return [$test, $changedQuestions];
    }

    public function getPublicTestPayload(string $testId): ?array
    {
        $test = $this->testsRepository->getTestById($testId);
        if (!$test) {
            return null;
        }

        $alphabet = range('A', 'Z');

        $questions = $test->questions->map(function ($question) use ($alphabet) {
            $options = $question->options ?? [];
            $files = $question->files->map(fn ($file) => [
                'id' => $file->id,
                'name' => $file->name,
                'alias' => $file->alias,
                'mime_type' => $file->mime_type,
                'size' => $file->size,
                'url' => Storage::disk('public')->url($file->alias),
            ])->values()->all();

            if ($question->type === 'single' || $question->type === 'multiple') {
                return [
                    'id' => $question->id,
                    'question' => $question->title,
                    'type' => $question->type,
                    'options' => array_values($options['options'] ?? []),
                    'correctAnswers' => array_values($options['correctOptions'] ?? []),
                    'files' => $files,
                ];
            }

            if ($question->type === 'matching') {
                $terms = array_values($options['terms'] ?? []);
                $meanings = array_values($options['meanings'] ?? []);
                $matches = array_values($options['matches'] ?? []);

                $termsMap = [];
                foreach ($terms as $index => $term) {
                    $key = $alphabet[$index] ?? (string) ($index + 1);
                    $termsMap[$key] = $term;
                }

                $meaningsMap = [];
                foreach ($meanings as $index => $meaning) {
                    $meaningsMap[$index] = $meaning;
                }

                $correct = [];
                foreach ($matches as $index => $termKey) {
                    if (!empty($termKey)) {
                        $correct[] = $termKey . $index;
                    }
                }

                return [
                    'id' => $question->id,
                    'question' => $question->title,
                    'type' => $question->type,
                    'terms' => $termsMap,
                    'meanings' => $meaningsMap,
                    'correctAnswers' => $correct,
                    'files' => $files,
                ];
            }

            return [
                'id' => $question->id,
                'question' => $question->title,
                'type' => $question->type,
                'correctAnswers' => array_values($options['answers'] ?? []),
                'files' => $files,
            ];
        })->values()->all();

        return [
            'id' => $test->id,
            'title' => $test->title,
            'is_current_user_creator' => $test->is_current_user_creator,
            'questions' => $questions,
        ];
    }

    public function deleteTest(string $testId): bool
    {
        $test = $this->testsRepository->getTestById($testId);
        if (!$test) {
            return false;
        }

        $snapshot = $this->mapTestSnapshot($test);
        $test->delete();
        $this->auditService->auditTestDeleted(auth()->user(), $snapshot);

        return true;
    }

    private function mapTestSnapshot(Test $test): array
    {
        return [
            'id' => $test->id,
            'title' => $test->title,
            'link' => '/workbench/test/' . $test->id,
        ];
    }
}

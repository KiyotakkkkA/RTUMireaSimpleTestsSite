<?php

namespace App\Services;

use App\Models\Test\Test;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{
    public function makeTestToPDF(string $testId)
    {
        $test = Test::with('questions.files')->findOrFail($testId);

        $alphabet = range('A', 'Z');

        $questions = $test->questions->values()->map(function ($question) use ($alphabet) {
            $options = $question->options ?? [];
            $files = $question->files->map(function ($file) {
                $absolutePath = Storage::disk('public')->path($file->alias);
                $normalizedPath = str_replace('\\', '/', $absolutePath);
                $isWindowsPath = preg_match('/^[A-Za-z]:\//', $normalizedPath) === 1;
                $absoluteUrl = $isWindowsPath
                    ? 'file:///' . $normalizedPath
                    : 'file://' . $normalizedPath;

                $dataUri = null;
                if (is_file($absolutePath)) {
                    $mime = $file->mime_type ?: mime_content_type($absolutePath) ?: 'application/octet-stream';
                    $data = base64_encode(file_get_contents($absolutePath));
                    $dataUri = "data:{$mime};base64,{$data}";
                }

                return [
                'id' => $file->id,
                'name' => $file->name,
                'alias' => $file->alias,
                'mime_type' => $file->mime_type,
                'size' => $file->size,
                'url' => Storage::disk('public')->url($file->alias),
                'absolute_path' => $normalizedPath,
                'absolute_url' => $absoluteUrl,
                'data_uri' => $dataUri,
                ];
            })->values()->all();

            if ($question->type === 'single' || $question->type === 'multiple') {
                $labels = array_values($options['options'] ?? []);
                $correct = array_map('intval', array_values($options['correctOptions'] ?? []));
                $mapped = [];
                foreach ($labels as $idx => $label) {
                    $mapped[] = [
                        'index' => $idx,
                        'label' => $label,
                        'is_correct' => in_array($idx, $correct, true),
                    ];
                }

                return [
                    'id' => $question->id,
                    'question' => $question->title,
                    'type' => $question->type,
                    'files' => $files,
                    'options' => $mapped,
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
                    $meaningsMap[$idx] = $meaning;
                }

                $correctPairs = [];
                foreach ($meanings as $idx => $meaning) {
                    $termKey = $matches[$idx] ?? '';
                    if (!$termKey) {
                        continue;
                    }
                    $correctPairs[] = [
                        'termKey' => $termKey,
                        'termText' => $termsMap[$termKey] ?? '',
                        'meaningIndex' => $idx + 1,
                        'meaningText' => $meaning,
                    ];
                }

                return [
                    'id' => $question->id,
                    'question' => $question->title,
                    'type' => $question->type,
                    'files' => $files,
                    'terms' => $termsMap,
                    'meanings' => $meaningsMap,
                    'correctPairs' => $correctPairs,
                ];
            }

            $answers = array_values($options['answers'] ?? []);

            return [
                'id' => $question->id,
                'question' => $question->title,
                'type' => $question->type,
                'files' => $files,
                'answers' => $answers,
            ];
        })->all();

        $pdf = Pdf::loadView('reports.test_pdf', [
            'test' => $test,
            'questions' => $questions,
            'generatedAt' => now()->format('d.m.Y H:i'),
        ])
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setPaper('a4', 'portrait');

        return $pdf;
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
}

<?php

namespace App\Services\Reports;

use App\Filters\Admin\AdminAuditFilter;
use App\Models\Audit;
use App\Models\Test\Test;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReportPDFService
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

    public function makeAuditToPDF(array $filters)
    {
        $query = Audit::query()->with('user')->orderByDesc('id');
        (new AdminAuditFilter($filters))->apply($query);

        $records = $query->get()->map(function (Audit $audit) {
            return [
                'id' => $audit->id,
                'action_type' => $audit->action_type,
                'comment' => $audit->comment,
                'created_at' => $audit->created_at,
                'actor' => $audit->user ? [
                    'id' => $audit->user->id,
                    'name' => $audit->user->name,
                    'email' => $audit->user->email,
                ] : null,
                'old_object_state' => $audit->old_object_state,
                'new_object_state' => $audit->new_object_state,
            ];
        })->values()->all();

        $pdf = Pdf::loadView('reports.audit_pdf', [
            'records' => $records,
            'generatedAt' => now()->format('d.m.Y H:i'),
            'filters' => $filters,
        ])
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setPaper('a4', 'portrait');

        return $pdf;
    }
}

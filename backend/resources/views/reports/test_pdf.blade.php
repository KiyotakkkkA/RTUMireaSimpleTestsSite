<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>Testix PDF — {{ $test->title }}</title>
</head>
<body style="font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; margin: 0;">
    @php
        use Illuminate\Support\Str;
        $typeLabels = [
            'single' => 'Один вариант',
            'multiple' => 'Несколько вариантов',
            'matching' => 'Соответствие',
            'full_answer' => 'Полный ответ',
        ];
    @endphp

    <div style="background: #EEF2FF; border-bottom: 2px solid #4F46E5; padding: 18px 24px 16px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="vertical-align: top; padding: 0;">
                    <div style="font-size: 20px; font-weight: 800; font-family: DejaVu Sans, Arial, sans-serif; color: #4F46E5;">Testix</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1F2937; margin-top: 2px;">Выгрузка вопросов тестирования</div>
                </td>
                <td style="vertical-align: top; text-align: right; padding: 0;">
                    <div style="font-size: 13px; color: #6B7280; margin-top: 4px;">Сформировано: {{ $generatedAt }}</div>
                </td>
            </tr>
        </table>
        <div style="height: 6px; background: #E0E7FF; border-radius: 999px; margin-top: 12px;"></div>
    </div>

    <div style="padding: 18px 24px 24px;">

    <div style="border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; margin-bottom: 16px; page-break-inside: avoid; text-align: center">
        <h3>{{ $test->title }}</h3>
    </div>

    @foreach ($questions as $question)
        <div style="border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; margin-bottom: 16px; page-break-inside: avoid;">
            <div style="font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 6px;">
                Вопрос {{ $loop->iteration }}
            </div>
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">{{ $question['question'] }}</div>
            <div style="font-size: 11px; color: #6B7280; margin-bottom: 10px;">
                Тип: {{ $typeLabels[$question['type']] ?? $question['type'] }}
            </div>

            @if (!empty($question['files']))
                @foreach ($question['files'] as $file)
                    @if (!empty($file['mime_type']) && Str::startsWith($file['mime_type'], 'image/'))
                        @php
                            $imageSrc = $file['data_uri'] ?? $file['absolute_url'] ?? $file['url'];
                        @endphp
                        <div style="margin-bottom: 10px;">
                            <img src="{{ $imageSrc }}" alt="{{ $file['name'] }}" style="max-width: 100%; border: 1px solid #E5E7EB; border-radius: 8px; display: block;" />
                        </div>
                    @endif
                @endforeach
            @endif

            @if ($question['type'] === 'single' || $question['type'] === 'multiple')
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">Варианты ответов</div>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    @foreach ($question['options'] as $option)
                        <li style="padding: 8px 10px; margin-bottom: 6px; border-radius: 8px; border: 1px solid {{ $option['is_correct'] ? '#10B981' : '#E5E7EB' }}; background: {{ $option['is_correct'] ? '#ECFDF5' : '#FFFFFF' }};">
                            <span style="font-weight: 700; color: {{ $option['is_correct'] ? '#047857' : '#374151' }}; margin-right: 6px;">
                                {{ $option['is_correct'] ? '✔' : '•' }}
                            </span>
                            <span style="color: #111827;">{{ $option['label'] }}</span>
                        </li>
                    @endforeach
                </ul>
            @elseif ($question['type'] === 'matching')
                <div style="display: flex; gap: 14px; margin-bottom: 12px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Термины</div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                @foreach ($question['terms'] as $key => $term)
                                    <tr>
                                        <td style="width: 32px; padding: 6px 8px; border: 1px solid #E5E7EB; background: #EEF2FF; font-weight: 700; text-align: center;">{{ $key }}</td>
                                        <td style="padding: 6px 8px; border: 1px solid #E5E7EB;">{{ $term }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Понятия</div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                @foreach ($question['meanings'] as $index => $meaning)
                                    <tr>
                                        <td style="width: 32px; padding: 6px 8px; border: 1px solid #E5E7EB; background: #ECFDF5; font-weight: 700; text-align: center;">{{ $index + 1 }}</td>
                                        <td style="padding: 6px 8px; border: 1px solid #E5E7EB;">{{ $meaning }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Правильные соответствия</div>
                @if (!empty($question['correctPairs']))
                    <ul style="padding-left: 16px; margin: 0;">
                        @foreach ($question['correctPairs'] as $pair)
                            <li style="margin-bottom: 4px;">
                                <span style="font-weight: 700; color: #2563EB;">{{ $pair['termKey'] }}</span>
                                <span style="color: #111827;"> {{ $pair['termText'] }}</span>
                                <span style="color: #9CA3AF; margin: 0 6px;">→</span>
                                <span style="font-weight: 700; color: #059669;">{{ $pair['meaningIndex'] }}</span>
                                <span style="color: #111827;"> {{ $pair['meaningText'] }}</span>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <div style="font-size: 11px; color: #6B7280;">Соответствия не заполнены.</div>
                @endif
            @else
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 6px;">Правильный ответ</div>
                @if (!empty($question['answers']))
                    <ul style="padding-left: 16px; margin: 0;">
                        @foreach ($question['answers'] as $answer)
                            <li style="margin-bottom: 4px;">{{ $answer }}</li>
                        @endforeach
                    </ul>
                @else
                    <div style="font-size: 11px; color: #6B7280;">Правильный ответ не указан.</div>
                @endif
            @endif
        </div>
    @endforeach
    </div>
</body>
</html>

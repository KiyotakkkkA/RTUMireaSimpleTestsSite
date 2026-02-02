<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>Testix PDF — Журнал аудита</title>
</head>
<body style="font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color: #111827; margin: 0;">
    @php
        $actionLabels = [
            'admin_roles_change' => 'Изменение ролей',
            'admin_permissions_change' => 'Изменение прав',
            'admin_user_add' => 'Добавление пользователя',
            'admin_user_remove' => 'Удаление пользователя',
            'test_created' => 'Создание теста',
            'test_updated' => 'Изменение теста',
            'test_deleted' => 'Удаление теста',
            'test_access_updated' => 'Доступ к тесту',
        ];
    @endphp

    <div style="background: #EEF2FF; border-bottom: 2px solid #4F46E5; padding: 18px 24px 16px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="vertical-align: top; padding: 0;">
                    <div style="font-size: 20px; font-weight: 800; font-family: DejaVu Sans, Arial, sans-serif; color: #4F46E5;">Testix</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1F2937; margin-top: 2px;">Выгрузка журнала аудита</div>
                </td>
                <td style="vertical-align: top; text-align: right; padding: 0;">
                    <div style="font-size: 13px; color: #6B7280; margin-top: 4px;">Сформировано: {{ $generatedAt }}</div>
                </td>
            </tr>
        </table>
        <div style="height: 6px; background: #E0E7FF; border-radius: 999px; margin-top: 12px;"></div>
    </div>

    <div style="padding: 18px 24px 24px;">
        <div style="border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
            <div style="font-size: 12px; color: #6B7280;">Фильтры</div>
            <div style="margin-top: 6px; font-size: 12px;">
                <strong>Тип события:</strong> {{ $actionLabels[$filters['action_type'] ?? ''] ?? 'Все' }}
            </div>
            <div style="margin-top: 4px; font-size: 12px;">
                <strong>Период:</strong>
                {{ $filters['date_from'] ?? '—' }} — {{ $filters['date_to'] ?? '—' }}
            </div>
        </div>

        @foreach ($records as $record)
            <div style="border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid;">
                <div style="font-size: 12px; color: #6B7280;">Событие #{{ $record['id'] }}</div>
                <div style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 4px;">
                    {{ $actionLabels[$record['action_type']] ?? $record['action_type'] }}
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">
                    Дата: {{ \Carbon\Carbon::parse($record['created_at'])->format('d.m.Y H:i') }}
                </div>
                <div style="font-size: 12px; color: #374151; margin-top: 4px;">
                    Автор: {{ $record['actor']['name'] ?? '—' }}
                    @if (!empty($record['actor']['email']))
                        ({{ $record['actor']['email'] }})
                    @endif
                </div>
                @if (!empty($record['comment']))
                    <div style="font-size: 12px; color: #111827; margin-top: 6px;">
                        Комментарий: {{ $record['comment'] }}
                    </div>
                @endif

                <div style="margin-top: 10px;">
                    @switch($record['action_type'])
                        @case('admin_roles_change')
                            @include('reports.audit.admin_roles_change', ['record' => $record])
                            @break
                        @case('admin_permissions_change')
                            @include('reports.audit.admin_permissions_change', ['record' => $record])
                            @break
                        @case('admin_user_add')
                            @include('reports.audit.admin_user_add', ['record' => $record])
                            @break
                        @case('admin_user_remove')
                            @include('reports.audit.admin_user_remove', ['record' => $record])
                            @break
                        @case('test_created')
                            @include('reports.audit.test_created', ['record' => $record])
                            @break
                        @case('test_updated')
                            @include('reports.audit.test_updated', ['record' => $record])
                            @break
                        @case('test_deleted')
                            @include('reports.audit.test_deleted', ['record' => $record])
                            @break
                        @case('test_access_updated')
                            @include('reports.audit.test_access_updated', ['record' => $record])
                            @break
                        @default
                            <div style="font-size: 11px; color: #6B7280;">Данные недоступны.</div>
                    @endswitch
                </div>
            </div>
        @endforeach
    </div>
</body>
</html>

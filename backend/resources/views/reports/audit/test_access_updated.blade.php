@php
    $old = $record['old_object_state']['access'] ?? [];
    $new = $record['new_object_state']['access'] ?? [];
    $statusLabels = [
        'all' => 'Доступен всем',
        'auth' => 'Только авторизованные',
        'protected' => 'Выборочно',
        'link' => 'По ссылке',
    ];
@endphp

<div style="display: flex; gap: 10px;">
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Было</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Статус: {{ $statusLabels[$old['status'] ?? ''] ?? '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">
                Пользователи: {{ isset($old['users']) ? count($old['users']) : 0 }}
            </div>
        </div>
    </div>
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Стало</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Статус: {{ $statusLabels[$new['status'] ?? ''] ?? '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">
                Пользователи: {{ isset($new['users']) ? count($new['users']) : 0 }}
            </div>
        </div>
    </div>
</div>

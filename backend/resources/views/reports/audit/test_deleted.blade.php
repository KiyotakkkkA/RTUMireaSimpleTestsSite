@php
    $old = $record['old_object_state'] ?? [];
    $test = $old['test'] ?? null;
@endphp

<div style="display: flex; gap: 10px;">
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Тест</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Название: {{ $test['title'] ?? '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">ID: {{ $test['id'] ?? '—' }}</div>
        </div>
    </div>
</div>

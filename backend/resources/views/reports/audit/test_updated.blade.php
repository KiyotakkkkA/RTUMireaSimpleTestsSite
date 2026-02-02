@php
    $new = $record['new_object_state'] ?? [];
    $test = $new['test'] ?? null;
    $changes = $new['changed_questions'] ?? [];
@endphp

<div style="display: flex; gap: 10px;">
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Тест</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Название: {{ $test['title'] ?? '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">ID: {{ $test['id'] ?? '—' }}</div>
        </div>
    </div>
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Изменения</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            @if (!empty($changes))
                <ul style="margin: 0; padding-left: 16px;">
                    @foreach ($changes as $item)
                        <li style="font-size: 11px; color: #111827; margin-bottom: 4px;">
                            {{ $item['title'] ?? '—' }}
                            @if (!empty($item['action']))
                                — {{ $item['action'] }}
                            @endif
                        </li>
                    @endforeach
                </ul>
            @else
                <div style="font-size: 11px; color: #6B7280;">—</div>
            @endif
        </div>
    </div>
</div>

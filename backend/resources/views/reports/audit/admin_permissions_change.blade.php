@php
    $old = $record['old_object_state'] ?? [];
    $new = $record['new_object_state'] ?? [];
    $user = $new['user'] ?? $old['user'] ?? null;
    $oldPerms = $old['permissions'] ?? [];
    $newPerms = $new['permissions'] ?? [];
@endphp

<div style="display: flex; gap: 10px;">
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Было</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Пользователь: {{ $user['name'] ?? '—' }} @if(!empty($user['email'])) ({{ $user['email'] }}) @endif</div>
            <div style="font-size: 11px; color: #111827; margin-top: 6px;">Права: {{ !empty($oldPerms) ? implode(', ', $oldPerms) : '—' }}</div>
        </div>
    </div>
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Стало</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Пользователь: {{ $user['name'] ?? '—' }} @if(!empty($user['email'])) ({{ $user['email'] }}) @endif</div>
            <div style="font-size: 11px; color: #111827; margin-top: 6px;">Права: {{ !empty($newPerms) ? implode(', ', $newPerms) : '—' }}</div>
        </div>
    </div>
</div>

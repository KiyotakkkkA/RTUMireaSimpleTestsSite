@php
    $new = $record['new_object_state'] ?? [];
    $user = $new['user'] ?? null;
    $roles = $new['roles'] ?? [];
    $perms = $new['permissions'] ?? [];
@endphp

<div style="display: flex; gap: 10px;">
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Данные пользователя</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Имя: {{ $user['name'] ?? '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">Email: {{ $user['email'] ?? '—' }}</div>
        </div>
    </div>
    <div style="flex: 1;">
        <div style="font-size: 11px; font-weight: 600; color: #6B7280; margin-bottom: 4px;">Роли и права</div>
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 8px;">
            <div style="font-size: 11px; color: #111827;">Роли: {{ !empty($roles) ? implode(', ', $roles) : '—' }}</div>
            <div style="font-size: 11px; color: #111827; margin-top: 4px;">Права: {{ !empty($perms) ? implode(', ', $perms) : '—' }}</div>
        </div>
    </div>
</div>

export const PERMISSION_LABELS: Record<string, string> = {
  'create tests': 'создавать тесты',
  'edit tests': 'редактировать тесты',
  'delete tests': 'удалять тесты',
  'add users': 'добавлять обычных пользователей',
  'remove users': 'удалять обычных пользователей',
  'assign admin role': 'назначать пользователям роль админа',
  'assign editor role': 'назначать пользователям роль редактора',
  'assign permissions': 'управлять правами пользователей',
  'view admin panel': 'открывать админскую панель',
};

export const ROLE_RANKS: Record<string, number> = {
  user: 0,
  editor: 1,
  admin: 2,
  root: 3,
};
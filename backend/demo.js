const now = Math.floor(Date.now() / 1000);

const people = {
  anna: { author_id: 'anna', author: 'Анна Иванова', avatar: 'images/anna.jpg' },
  alex: { author_id: 'alex', author: 'Алексей Петров', avatar: 'images/alex.jpg' },
  maria: { author_id: 'maria', author: 'Мария Волкова', avatar: 'images/maria.jpg' },
};

export const mailTemplates = [
  { from: 'anna@workspace.test', subject: 'Планирование квартала', body: 'Подготовила первый набросок плана на квартал.' },
  { from: 'alex@workspace.test', subject: 'Отчёт готов', body: 'Итоговый отчёт уже доступен команде.' },
  { from: 'maria@workspace.test', subject: 'Встреча команды завтра', body: 'Предлагаю сверить цели на короткой встрече утром.' },
  { from: 'design@workspace.test', subject: 'Новые макеты', body: 'Обновили основные экраны, можно смотреть.' },
  { from: 'ops@workspace.test', subject: 'Обновление внутреннего портала', body: 'Плановое обновление пройдёт вечером.' },
];

export const posts = [
  { id: 'office', ...people.anna, title: 'Новый офис в центре города', image: 'images/workspace.jpg', created: now - 4 * 3600 },
  { id: 'planning', ...people.alex, title: 'Что запланировали на следующий квартал', image: 'images/planning.jpg', created: now - 26 * 3600 },
  { id: 'team', ...people.maria, title: 'Итоги встречи команды', image: 'images/team.jpg', created: now - 52 * 3600 },
];

const commentTemplates = [
  ['office', 'maria', 'Отличное место для еженедельных встреч.', 2],
  ['office', 'alex', 'Жду открытия. Особенно понравилась переговорная.', 1],
  ['planning', 'anna', 'Добавила в план отдельный блок про обратную связь.', 20],
  ['planning', 'maria', 'Хорошо, что у задач появились ответственные.', 18],
  ['team', 'alex', 'Спасибо за встречу. Выводы уже в общем документе.', 48],
];

export const comments = commentTemplates.map(([post_id, person, content, hoursAgo], index) => ({
  id: `comment-${index + 1}`,
  post_id,
  ...people[person],
  content,
  created: now - hoursAgo * 3600,
}));

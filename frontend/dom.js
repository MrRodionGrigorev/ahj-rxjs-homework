export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric',
});

export function timeElement(seconds) {
  const date = new Date(seconds * 1000);
  const parts = Object.fromEntries(dateFormat.formatToParts(date).map(({ type, value }) => [type, value]));
  const time = element('time', 'timestamp', `${parts.hour}:${parts.minute} ${parts.day}.${parts.month}.${parts.year}`);
  time.dateTime = date.toISOString();
  return time;
}

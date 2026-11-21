import { catchError, exhaustMap, interval, of, startWith } from 'rxjs';
import { getList } from './api.js';
import { element, timeElement } from './dom.js';

function messageRow(message) {
  const row = element('tr');
  const sender = element('th', 'sender', message.from);
  sender.scope = 'row';
  const letters = Array.from(message.subject);
  const subject = letters.length > 15 ? `${letters.slice(0, 15).join('')}…` : message.subject;
  const subjectCell = element('td', null, subject);
  subjectCell.title = message.subject;
  const received = element('td', 'received');
  received.append(timeElement(message.received));
  row.append(sender, subjectCell, received);
  return row;
}

export function mountInbox(root) {
  const table = root.querySelector('tbody');
  const empty = root.querySelector('[data-empty]');
  const knownIds = new Set();

  interval(5000).pipe(
    startWith(0),
    exhaustMap(() => getList('messages/unread', 'messages').pipe(catchError(() => of([])))),
  ).subscribe((messages) => {
    const batch = document.createDocumentFragment();
    for (const message of messages.toSorted((a, b) => b.received - a.received)) {
      if (knownIds.has(message.id)) continue;
      knownIds.add(message.id);
      batch.append(messageRow(message));
    }
    table.prepend(batch);
    empty.hidden = knownIds.size > 0;
  });
}

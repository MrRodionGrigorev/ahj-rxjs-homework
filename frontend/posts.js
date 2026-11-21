import { catchError, forkJoin, fromEvent, map, of, startWith, switchMap } from 'rxjs';
import { getList, mediaUrl } from './api.js';
import { element, timeElement } from './dom.js';

function latestPosts() {
  return getList('posts/latest', 'data').pipe(
    switchMap((posts) => posts.length ? forkJoin(posts.map((post) => {
      const id = encodeURIComponent(post.id);
      return getList(`posts/${id}/comments/latest`, 'data').pipe(
        map((comments) => ({ ...post, comments })),
        catchError(() => of({ ...post, comments: null })),
      );
    })) : of([])),
  );
}

function image(path, className, alt = '') {
  const url = mediaUrl(path);
  if (!url) return null;
  const node = element('img', className);
  node.src = url;
  node.alt = alt;
  node.loading = 'lazy';
  return node;
}

function authorLine(record) {
  const line = element('div', 'author-line');
  const avatar = image(record.avatar, 'avatar');
  if (avatar) line.append(avatar);
  const details = element('div');
  details.append(element('strong', null, record.author), timeElement(record.created));
  line.append(details);
  return line;
}

function renderPost(post) {
  const card = element('article', 'panel post-card');
  card.append(authorLine(post), element('h2', null, post.title));
  const cover = image(post.image, 'post-image', post.title);
  if (cover) card.append(cover);

  const comments = element('section', 'comments');
  comments.append(element('h3', null, 'Последние комментарии'));
  if (post.comments?.length) {
    const list = element('ul', 'comment-list');
    for (const comment of post.comments) {
      const item = element('li');
      item.append(authorLine(comment), element('p', null, comment.content));
      list.append(item);
    }
    comments.append(list);
  } else {
    comments.append(element('p', 'muted', post.comments ? 'Комментариев пока нет.' : 'Комментарии временно недоступны.'));
  }
  card.append(comments);
  return card;
}

export function mountPosts(root) {
  const list = root.querySelector('[data-posts]');
  const status = root.querySelector('[data-post-status]');
  const retry = root.querySelector('[data-retry-posts]');

  fromEvent(retry, 'click').pipe(
    startWith(null),
    switchMap(() => {
      retry.disabled = true;
      status.textContent = 'Загружаем публикации…';
      return latestPosts().pipe(catchError(() => of(null)));
    }),
  ).subscribe((posts) => {
    retry.hidden = posts !== null;
    retry.disabled = false;
    if (posts === null) {
      status.textContent = 'Публикации временно недоступны.';
      return;
    }
    list.replaceChildren(...posts.map(renderPost));
    status.textContent = posts.length ? '' : 'Публикаций пока нет.';
  });
}

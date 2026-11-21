import { randomInt, randomUUID } from 'node:crypto';
import { Router } from 'express';
import { comments, mailTemplates, posts } from './demo.js';

export const messageRouter = Router();
export const postRouter = Router();

messageRouter.get('/unread', (_request, response) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const first = randomInt(mailTemplates.length);
  const messages = Array.from({ length: randomInt(1, 3) }, (_, index) => ({
    id: randomUUID(),
    ...mailTemplates[(first + index) % mailTemplates.length],
    received: timestamp - index,
  }));

  response.set('Cache-Control', 'no-store').json({ status: 'ok', timestamp, messages });
});

postRouter.get('/latest', (_request, response) => {
  const data = posts.toSorted((a, b) => b.created - a.created).slice(0, 10);
  response.json({ status: 'ok', data });
});

postRouter.get('/:postId/comments/latest', (request, response) => {
  const { postId } = request.params;
  if (!posts.some((post) => post.id === postId)) {
    return response.status(404).json({ status: 'error', message: 'Пост не найден' });
  }

  const data = comments.filter((comment) => comment.post_id === postId)
    .sort((a, b) => b.created - a.created).slice(0, 3);
  return response.json({ status: 'ok', data });
});

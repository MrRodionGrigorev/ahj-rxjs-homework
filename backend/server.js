import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { messageRouter, postRouter } from './routes.js';

const app = express();
const port = Number(process.env.PORT || 8090);
const host = process.env.HOST || (process.env.RENDER === 'true' ? '0.0.0.0' : '127.0.0.1');
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const publicApi = cors({ methods: ['GET', 'HEAD'] });

app.disable('x-powered-by');
app.use((_request, response, next) => {
  response.set('X-Content-Type-Options', 'nosniff');
  next();
});
app.use('/messages', publicApi, messageRouter);
app.use('/posts', publicApi, postRouter);
app.use(express.static(dist));
app.use((_request, response) => response.status(404).json({ status: 'error', message: 'Маршрут не найден' }));
app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error instanceof URIError) {
    return response.status(400).json({ status: 'error', message: 'Некорректный адрес запроса' });
  }
  console.error(error);
  return response.status(500).json({ status: 'error', message: 'Ошибка сервера' });
});

app.listen(port, host, () => console.log(`RxJS Workspace: http://${host}:${port}/`));

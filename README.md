# RxJS Workspace

[![Сборка и публикация](https://github.com/MrRodionGrigorev/ahj-rxjs-homework/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrRodionGrigorev/ahj-rxjs-homework/actions/workflows/deploy.yml)

[Адрес GitHub Pages после публикации](https://mrrodiongrigorev.github.io/ahj-rxjs-homework/)

```sh
npm ci
npm start
```

Откройте [http://127.0.0.1:8090/](http://127.0.0.1:8090/). Express обслуживает JSON API и клиент, собранный Webpack.

- **Входящие** — `GET /messages/unread` при открытии раздела и затем каждые пять секунд. Новые сообщения добавляются сверху.
- **Публикации** — `GET /posts/latest` и `GET /posts/:postId/comments/latest`. RxJS объединяет посты с комментариями до отрисовки.
- **Проекты** — выберите проект и переключите флажок задачи. Оба виджета подписаны на общий `Store` в памяти браузера.

При публикации выберите в настройках GitHub Pages источник **GitHub Actions**. Для работы входящих и публикаций добавьте в переменную репозитория `API_URL` HTTPS-адрес развёрнутого Express-сервера. Сервер на хостинге можно запустить через `npm start` с переменными `HOST=0.0.0.0` и `PORT`, предоставленным хостингом.

Демонстрационные фотографии и аватары — [Unsplash](https://unsplash.com/license).

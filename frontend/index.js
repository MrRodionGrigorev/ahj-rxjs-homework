import './style.css';
import { mountDashboard } from './dashboard.js';
import { mountInbox } from './inbox.js';
import { mountPosts } from './posts.js';

const views = new Map([
  ['inbox', { title: 'Входящие', mount: mountInbox }],
  ['posts', { title: 'Публикации', mount: mountPosts }],
  ['dashboard', { title: 'Проекты', mount: mountDashboard }],
]);

function showView() {
  const requested = location.hash.slice(1);
  const current = views.has(requested) ? requested : 'inbox';
  for (const [name, view] of views) {
    const root = document.querySelector(`#${name}`);
    const link = document.querySelector(`[href="#${name}"]`);
    const active = name === current;
    root.hidden = !active;
    if (active) {
      link.setAttribute('aria-current', 'page');
      if (!view.mounted) {
        view.mount(root);
        view.mounted = true;
      }
    } else {
      link.removeAttribute('aria-current');
    }
  }
  document.title = `${views.get(current).title} · RxJS Workspace`;
}

window.addEventListener('hashchange', showView);
showView();

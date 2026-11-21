import { BehaviorSubject } from 'rxjs';
import { element } from './dom.js';

const projects = [
  { id: 1, name: 'Внутренний портал', tasks: [
    { id: 11, name: 'Собрать обратную связь от команды', done: false },
    { id: 12, name: 'Обновить страницу профиля', done: false },
    { id: 13, name: 'Согласовать новую навигацию', done: true },
  ] },
  { id: 2, name: 'Личный кабинет', tasks: [
    { id: 21, name: 'Подготовить макет настроек', done: true },
    { id: 22, name: 'Проверить форму регистрации', done: false },
    { id: 23, name: 'Дополнить справку по аккаунту', done: false },
  ] },
  { id: 3, name: 'iOS App', tasks: [
    { id: 31, name: 'Push Notifications', done: true },
    { id: 32, name: 'Apple Pay Support', done: false },
  ] },
];

class Store {
  #state;

  constructor(projects) {
    this.#state = new BehaviorSubject({ projects, selectedProjectId: projects[0].id });
    this.state$ = this.#state.asObservable();
  }

  selectProject(id) {
    const state = this.#state.value;
    if (state.projects.some((project) => project.id === id)) {
      this.#state.next({ ...state, selectedProjectId: id });
    }
  }

  setTaskDone(projectId, taskId, done) {
    const state = this.#state.value;
    const projects = state.projects.map((project) => {
      if (project.id !== projectId) return project;
      const tasks = project.tasks.map((task) => task.id === taskId ? { ...task, done } : task);
      return { ...project, tasks };
    });
    this.#state.next({ ...state, projects });
  }
}

class ProjectStats {
  constructor(root, store) {
    store.state$.subscribe(({ projects }) => {
      const rows = projects.map((project) => {
        const count = project.tasks.filter((task) => !task.done).length;
        const row = element('li', 'stat-row');
        row.append(element('span', null, project.name), element('data', 'count', count));
        row.lastElementChild.value = String(count);
        return row;
      });
      root.replaceChildren(...rows);
    });
  }
}

class ProjectTasks {
  #selectedId;
  #checkboxes = new Map();

  constructor(root, store) {
    const select = root.querySelector('select');
    const list = root.querySelector('ul');

    select.addEventListener('change', () => store.selectProject(Number(select.value)));
    list.addEventListener('change', ({ target }) => {
      store.setTaskDone(this.#selectedId, Number(target.value), target.checked);
    });

    store.state$.subscribe(({ projects, selectedProjectId }) => {
      if (!select.options.length) {
        for (const project of projects) select.add(new Option(project.name, String(project.id)));
      }

      const selected = projects.find((project) => project.id === selectedProjectId);
      if (this.#selectedId !== selected.id) {
        this.#selectedId = selected.id;
        select.value = String(selected.id);
        this.#checkboxes.clear();
        list.replaceChildren(...selected.tasks.map((task) => this.#taskRow(task)));
      }

      for (const task of selected.tasks) {
        this.#checkboxes.get(task.id).checked = task.done;
      }
    });
  }

  #taskRow(task) {
    const row = element('li');
    const label = element('label', 'task-row');
    const checkbox = element('input');
    checkbox.type = 'checkbox';
    checkbox.value = String(task.id);
    this.#checkboxes.set(task.id, checkbox);
    label.append(checkbox, element('span', null, task.name));
    row.append(label);
    return row;
  }
}

export function mountDashboard(root) {
  const store = new Store(projects);
  new ProjectStats(root.querySelector('[data-project-stats]'), store);
  new ProjectTasks(root.querySelector('[data-project-tasks]'), store);
}

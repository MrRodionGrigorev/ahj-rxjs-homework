import { map } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const apiBase = __API_URL__ ? new URL(`${__API_URL__.replace(/\/+$/, '')}/`) : new URL('/', location.origin);

export function getList(path, field) {
  return ajax({ url: new URL(path, apiBase).href, responseType: 'json', timeout: 4500 }).pipe(
    map(({ status, response }) => {
      if (status !== 200 || response?.status !== 'ok' || !Array.isArray(response[field])) {
        throw new Error('Некорректный ответ сервера');
      }
      return response[field];
    }),
  );
}

export function mediaUrl(path) {
  if (typeof path !== 'string' || !/^images\/[\w-]+\.jpg$/.test(path)) return null;
  return new URL(path, apiBase).href;
}

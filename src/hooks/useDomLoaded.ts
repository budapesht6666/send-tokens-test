import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void): () => void {
  // Сработает один раз когда DOM готов, если он ещё не готов.
  document.addEventListener('DOMContentLoaded', callback);
  return () => document.removeEventListener('DOMContentLoaded', callback);
}

function getSnapshot(): boolean {
  // true когда document.readyState !== 'loading'
  return document.readyState !== 'loading';
}

function getServerSnapshot(): boolean {
  // На сервере DOM отсутствует.
  return false;
}

export function useDomLoaded(): boolean {
  const isDomLoaded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isDomLoaded;
}

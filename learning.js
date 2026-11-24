'use strict';

const Learning = (() => {
  const key = 'enlang.progress.v1';
  let memory = {};

  let storageAvailable = true;

  function read() {
    if (!storageAvailable) return memory;
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      memory = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    } catch {}
    return memory;
  }

  function progress(lessons) {
    const saved = read();
    const completed = lessons.filter(({ id }) =>
      typeof saved[id] === 'string' && Number.isFinite(Date.parse(saved[id])));
    return {
      completed,
      xp: completed.reduce((total, lesson) => total + lesson.xp, 0),
      date: id => saved[id],
      status(index) {
        if (completed.includes(lessons[index])) return 'complete';
        if (index === 0 || completed.includes(lessons[index - 1])) return 'available';
        return 'locked';
      }
    };
  }

  function complete(lessons, index) {
    if (progress(lessons).status(index) !== 'available') return false;
    memory = { ...read(), [lessons[index].id]: new Date().toISOString() };
    try {
      localStorage.setItem(key, JSON.stringify(memory));
    } catch {
      storageAvailable = false;
    }
    return true;
  }

  return { progress, complete };
})();

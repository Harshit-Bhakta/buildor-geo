export type TaskProgress = {
  completedSubtasks: string[];
};

const STORAGE_KEY = "task-progress";

export function getProgress(): TaskProgress {
  if (typeof window === "undefined") {
    return { completedSubtasks: [] };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { completedSubtasks: [] };

  try {
    return JSON.parse(raw);
  } catch {
    return { completedSubtasks: [] };
  }
}

export function completeSubtask(subtaskId: string) {
  const progress = getProgress();

  if (!progress.completedSubtasks.includes(subtaskId)) {
    progress.completedSubtasks.push(subtaskId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("task-progress");
}

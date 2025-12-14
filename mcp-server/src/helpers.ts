export function getTasks() {
  return fetch('http://localhost:3000/api/task');
}
export function getTasksById(id: string) {
  return fetch(`http://localhost:3000/api/task/${id}`);
}

export function createTask(task: { title: string; description: string; status?: string }) {
  return fetch('http://localhost:3000/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
}

export function updateTask(
  id: string,
  task: { title?: string; description?: string; status?: 'todo' | 'in-progress' | 'done' }
) {
  return fetch(`http://localhost:3000/api/task/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
}

export function deleteTask(id: string) {
  return fetch(`http://localhost:3000/api/task/${id}`, {
    method: 'DELETE',
  });
}

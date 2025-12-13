import fs from 'fs/promises';
import { Status, Task } from '@/app/types';
import { DATAFILE, VALID_STATUSES } from './constants';

export async function getTasks(): Promise<Task[]> {
  const data = await fs.readFile(DATAFILE, 'utf-8');
  if (!data.trim()) {
    return [];
  }
  return JSON.parse(data);
}

export async function saveTasks(tasks: Task[]) {
  await fs.writeFile(DATAFILE, JSON.stringify(tasks, null, 2));
}

export function isValidTaskPayload(task: any): task is {
  title: string;
  description: string;
  status?: unknown;
} {
  return (
    typeof task?.title === 'string' &&
    task.title.trim().length > 0 &&
    typeof task?.description === 'string' &&
    task.description.trim().length > 0
  );
}

export function isStatus(value: any): value is Status {
  return typeof value === 'string' && VALID_STATUSES.includes(value as Status);
}

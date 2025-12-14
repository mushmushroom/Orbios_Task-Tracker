export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
}

export interface Column {
  id: Status;
  title: string;
  color: string;
}

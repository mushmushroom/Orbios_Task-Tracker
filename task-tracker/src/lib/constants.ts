import { Status } from '@/types';
import path from 'path';

export const DATAFILE = path.join(process.cwd(), 'src', 'data', 'tasks.json');

export const VALID_STATUSES = ['todo', 'in-progress', 'done'] as Status[];

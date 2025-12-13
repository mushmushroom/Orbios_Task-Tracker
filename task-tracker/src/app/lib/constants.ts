import path from 'path';
import { Status } from '../types';

export const DATAFILE = path.join(process.cwd(), 'src', 'app', 'data', 'tasks.json');

export const VALID_STATUSES = ['todo', 'in-progress', 'done'] as Status[];

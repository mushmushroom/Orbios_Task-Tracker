import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

import { getTasks, isStatus, isValidTaskPayload, saveTasks } from '@/lib/tasks';
import { Status } from '@/types';

export async function GET() {
  try {
    return NextResponse.json(await getTasks());
  } catch (error) {
    return NextResponse.json({ error: `Failed to read tasks: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidTaskPayload(body)) {
      return NextResponse.json(
        { error: 'Invalid task data (title and description required)' },
        { status: 400 }
      );
    }

    const tasks = await getTasks();

    const status: Status = isStatus(body.status) ? body.status : 'todo';

    const task = {
      id: uuid(),
      title: body.title.trim(),
      description: body.description.trim(),
      status,
    };

    tasks.push(task);
    await saveTasks(tasks);
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: `Failed to save tasks: ${error}` }, { status: 500 });
  }
}

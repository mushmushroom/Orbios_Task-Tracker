import { NextResponse } from 'next/server';
import { getTasks, saveTasks } from '@/app/lib/tasks';
import { VALID_STATUSES } from '@/app/lib/constants';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const paramsData = await params;
  try {
    // verify task exists
    const tasks = await getTasks();
    const idx = tasks.findIndex((t) => t.id === paramsData.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // verify body
    const body = await request.json();

    const { title, description, status } = body;

    if (title !== undefined && typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // update task
    const task = tasks[idx];

    tasks[idx] = {
      ...task,
      title: title !== undefined ? title.trim() : task.title,
      description: description !== undefined ? description.trim() : task.description,
      status: status ?? task.status,
    };

    await saveTasks(tasks);

    return NextResponse.json(tasks[idx]);
  } catch (error) {
    return NextResponse.json({ error: `Failed to update task: ${error}` }, { status: 500 });
  }
}

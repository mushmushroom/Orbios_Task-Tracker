import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4';
import { createTask, deleteTask, getTasks, updateTask } from './helpers';

const server = new McpServer({
  name: 'task-tracker-mcp',
  version: '1.0.0',
});

server.registerResource(
  'tasks',
  'task-tracker://tasks',
  {
    description: 'List all tasks',
    mimeType: 'application/json',
  },
  async () => {
    const res = await getTasks();
    const tasks = await res.json();

    return {
      contents: [
        {
          uri: 'task-tracker://tasks',
          mimeType: 'application/json',
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }
);

server.registerResource(
  'task-by-id',
  'task-tracker://tasks/{id}',
  {
    description: 'Get task by id',
    mimeType: 'application/json',
  },
  async (uri: URL) => {
    const id = uri.pathname.split('/').pop();
    const res = await fetch(`http://localhost:3000/api/task/${id}`);

    if (!res.ok) {
      return { contents: [] };
    }

    const task = await res.json();

    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: 'application/json',
          text: JSON.stringify(task, null, 2),
        },
      ],
    };
  }
);

server.registerResource(
  'task-report',
  'task-tracker://report/tasks',
  {
    description: 'Aggregated task report by status',
    mimeType: 'application/json',
  },
  async (_uri: URL) => {
    const res = await getTasks();

    if (!res.ok) {
      return { contents: [] };
    }

    const tasks: Array<{ status: string }> = await res.json();

    const report = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };

    return {
      contents: [
        {
          uri: 'task-tracker://report/tasks',
          mimeType: 'application/json',
          text: JSON.stringify(report, null, 2),
        },
      ],
    };
  }
);


server.registerTool(
  'create-task',
  {
    description: 'Create new task',
    inputSchema: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    }),
  },
  async ({ title, description, status = 'todo' }) => {
    try {
      const res = await createTask({ title, description, status });
      return {
        content: [{ type: 'text', text: `Task "${title}" created successfully` }],
      };
    } catch {
      return {
        content: [{ type: 'text', text: 'Failed to create task' }],
      };
    }
  }
);

server.registerTool(
  'update-task',
  {
    description: 'Update an existing task',
    inputSchema: z.object({
      id: z.string().min(1, 'Task id is required'),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      status: z.enum(['todo', 'in-progress', 'done']).optional(),
    }),
  },
  async ({ id, title, description, status }) => {
    try {
      const res = await updateTask(id, { title, description, status });

      if (!res.ok) {
        return {
          content: [{ type: 'text', text: 'Task not found or update failed' }],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: `Task ${id} updated successfully`,
          },
        ],
      };
    } catch {
      return {
        content: [{ type: 'text', text: 'Failed to update task' }],
      };
    }
  }
);

server.registerTool(
  'delete-task',
  {
    description: 'Delete a task',
    inputSchema: z.object({
      id: z.string().min(1, 'Task id is required'),
    }),
  },
  async ({id}) => {
    try {
      const res = await deleteTask(id);
      return {
        content: [{ type: 'text', text: 'Task was removed' }],
      };
    } catch {
      return {
        content: [{ type: 'text', text: 'Failed to remove task' }],
      };
    }
  }
);

// server.registerTool(
//   'generate-task-report',
//   {
//     description: 'Generate tasks report',
//     inputSchema: {},
//   },
//   async () => {
//     const res = await fetch('http://localhost:3000/api/task');
//     const tasks = await res.json();

//     const report = {
//       todo: tasks.filter((t: any) => t.status === 'todo').length,
//       inProgress: tasks.filter((t: any) => t.status === 'in-progress').length,
//       done: tasks.filter((t: any) => t.status === 'done').length,
//     };

//     return {
//       content: [
//         {
//           type: 'text',
//           text: `Task Report:\nTodo: ${report.todo}\nIn Progress: ${report.inProgress}\nDone: ${report.done}`,
//         },
//       ],
//     };
//   }
// );

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();

# MPC Server Configuration

## Selected Automation Task

The chosen automation task is Task Tracker MCP server.
It automates interaction with tasks by exposing them as resources and tools, allowing AI agents to:
- View tasks
- Retrieve task details
- Create new tasks
- Update task status or content
- Delete tasks
- Generate aggregated reports

## Architecture
The MCP Server is implemented using TypeScript and the official Model Context Protocol SDK.

Core technologies:
- @modelcontextprotocol/sdk
- TypeScript
- Zod 
- HTTP integration with an existing Next.js Task Tracker API

The server communicates via STDIO transport,

## Tools
The server provides three tools, each representing a mutation action:

1. create-task
Creates a new task.
Inputs: title, description, status

2. update-task
Updates an existing task.
Inputs: task ID + optional fields

3. delete-task
Deletes a task by ID.
Inputs: task ID

## Resources
1. task-tracker://tasks  
Returns a list of all tasks.

2. task-tracker://tasks/{id}  
Returns details of a specific task.

3. task-tracker://report/tasks  
Aggregated task report for all statuses.

## Example usage
Get all tasks
```
task-tracker://tasks
```

Get task by ID
```
task-tracker://tasks/123
```

Create a task (Tool call)
```
{
  "title": "Write documentation",
  "description": "Finish MCP server docs",
  "status": "in-progress"
}
```

## Problem Solved by This MCP Server
- AI can manage tasks directly
- Unified interface for reading and writing data
- Automated reporting and aggregation

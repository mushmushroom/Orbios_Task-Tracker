# Development Process

## Getting started
The first step was to analyze the requirements for the application and point out the core functionality that needs to be implemented.
The next step was to figure out the steps to build the features without bottleneck and delays.

## Code structure
The project was structured into a modular architecture to improve maintainability:
- app/api/ - API endpoints for tasks (GET, POST, PUT, DELETE)
- components/ - React components like TaskBoard and TaskCard
- lib/ - Helper functions and constants
This approach clearly separates concerns: API handling, UI components, and utility functions, making the code easier to maintain and extend.

## Challenges
Some challenges included:
- TypeScript typing issues with status values
- PUT/DELETE API routing with dynamic parameters in Next.js App Router — initially params.id was undefined 
These were resolved through debugging and with consulting Next.js documentation and AI tools.

## Improvements
If more time were available, I would:
- Implement persistent storage using a database instead of JSON files.
- Add user authentication and multi-user support.
- Expand reporting tools, such as generating charts or exporting task summaries.

## Experience with MCP
I integrated a custom MCP Server to expose the Task Tracker as a set of tools and resources:
- Tools: create-task, update-task, delete-task
- Resources: task-by-id, tasks, task-report

The MCP Server allowed AI agents to read tasks, update status, and generate reports without directly accessing the API.
The process involved:
- Researching MCP documentation and available guides.
- Implementing custom tools and resources for task management.
- Adding helper functions for improved structure and maintainability.



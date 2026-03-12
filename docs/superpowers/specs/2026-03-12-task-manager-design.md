# Task Manager CRUD App - Design Spec

## Overview

A simple task manager built with Next.js 14, TypeScript, and Tailwind CSS for deployment to Vercel. Uses localStorage for persistence - no external services required.

## Data Model

```typescript
interface Task {
  id: string;          // crypto.randomUUID()
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;   // ISO 8601
}
```

## Architecture

- **Framework:** Next.js 14, App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Browser localStorage
- **Deployment:** Vercel

### File Structure

```
src/
  app/
    layout.tsx        - Root layout with metadata
    page.tsx          - Main page, state management, CRUD logic
    globals.css       - Tailwind imports + base styles
  components/
    TaskList.tsx      - Renders tasks grouped/filtered by status
    TaskForm.tsx      - Create/edit form (inline)
    TaskCard.tsx      - Single task card with actions
  lib/
    types.ts          - Task type definition, StatusFilter type
    storage.ts        - localStorage read/write helpers
```

## Components

### page.tsx (Main Page)
- Holds all task state via useState
- Loads tasks from localStorage on mount
- Provides CRUD handler functions passed to child components
- Renders status filter tabs, TaskForm, and TaskList

### TaskList
- Receives filtered tasks array
- Renders TaskCard for each task
- Shows empty state when no tasks match filter

### TaskForm
- Controlled form with title (required) and description fields
- Supports both create and edit modes
- On submit, calls parent handler and resets form
- Cancel button in edit mode

### TaskCard
- Displays task title, description, status badge, and created date
- Status dropdown to change between todo/in-progress/done
- Edit button triggers parent edit callback
- Delete button with no confirmation (simple test app)

## Features

1. **Create** - Add new tasks with title and optional description
2. **Read** - View all tasks, filter by status (All/Todo/In Progress/Done)
3. **Update** - Edit task details, change status via dropdown
4. **Delete** - Remove tasks
5. **Persistence** - localStorage keeps data across page refreshes
6. **Responsive** - Works on mobile and desktop via Tailwind

## UI Layout

```
+------------------------------------------+
|  Task Manager                            |
+------------------------------------------+
|  [Title input] [Description] [Add Task]  |
+------------------------------------------+
|  [All] [Todo] [In Progress] [Done]       |
+------------------------------------------+
|  +------------------------------------+  |
|  | Task Title              [Status v] |  |
|  | Description text...                |  |
|  | Created: 2026-03-12   [Edit] [Del] |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  | Another Task            [Status v] |  |
|  | ...                                |  |
|  +------------------------------------+  |
+------------------------------------------+
```

## Non-Goals

- No authentication
- No server-side persistence
- No real-time sync
- No drag-and-drop reordering

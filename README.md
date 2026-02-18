# React File Explorer

A Mac-style file explorer built with React and Vite. Features a virtual file system with drag-and-drop, multiple view modes, and file previews.

## Features

- **Filesystem**: Recursive folder structure with navigation and breadcrumbs.
- **Views**: Toggle between Grid, List, and Graph views.
- **Actions**: Drag-and-drop (dnd-kit), context menus, keyboard shortcuts (Del, F2).
- **Previews**: Inline previews for images, videos, and PDFs.
- **Theme**: Dark/Light mode support.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS Variables + Tailwind CSS v4 |
| State | React Context + useReducer |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Icons | react-icons (Feather + Font Awesome) |
| PDF Viewer | react-pdf |
| Testing | Vitest + React Testing Library |

## Setup

```bash
npm install
npm run dev
```

## Structure

```
src/
├── components/      # UI components (Files, Graph, Preview, etc.)
├── context/         # Global state (FileExplorer, Modal)
├── hooks/           # Custom hooks (useContextMenu)
├── services/        # Mock API service
└── utils/           # File helpers
```

## Implementation Notes

- **Data Persistence**: Uses `localStorage` to persist the file tree between sessions. `mockApi.js` simulates async network calls.
- **State**: `useReducer` handles the complex file system state (selection, navigation, data fetching).
- **Dragging**: Implemented with `@dnd-kit`. Note the custom sensor in `AppLayout` to prevent right-clicks from triggering drags.
- **Graph View**: Simple canvas implementation for visualizing folder depth.

## Future Improvements

- Virtualization for large directories.
- Real backend integration.
- Optimization for heavy graph rendering.

# React File Explorer

A high-quality File Explorer application built with React, Vite, and Modern CSS — featuring file system-like navigation, inline previews, drag-and-drop, theming, and mock REST API integration.

## Features

### Core
- **Folder Tree Sidebar** – Hierarchical navigation with expand/collapse and drag-drop targets
- **Multiple Views** – Grid, List, and Graph (canvas-rendered node hierarchy)
- **Breadcrumb Navigation** – Shows current path with clickable segments
- **Drag-and-Drop** – Move files/folders via @dnd-kit integration
- **File Operations** – Rename (F2), Delete (Del key), Create Folder, Upload (multi-file)
- **Search** – Instant debounced search filtering
- **Sorting** – By name, size, or date (ascending/descending)
- **Context Menus** – Right-click for rename, delete, download actions
- **Keyboard Accessibility** – Arrow key navigation, Enter to open, Delete/F2 shortcuts

### File Previews
- **Images** (JPG, PNG, WebP, GIF, SVG) – Inline preview + fullscreen modal with zoom controls
- **Videos** (MP4, WebM) – Custom player with play/pause, seek bar, volume, time display
- **PDFs** – Embedded viewer with page navigation and zoom (react-pdf)
- **Code/Text** – Syntax-highlighted inline preview
- **Other Files** – Metadata display + download button

### Technical
- **Mock API** – GET, POST, PUT, DELETE with simulated latency and localStorage persistence
- **Optimistic-ready State** – Centralized useReducer with loading/error states and retry
- **JSON Export** – Export current folder structure as JSON at any level
- **Caching** – localStorage-backed data persistence across sessions
- **Error Handling** – Error banners with retry buttons, graceful fallbacks
- **Loading States** – Spinner overlay during async operations

### UI & Theming
- **Light & Dark Mode** – Toggle with centralized CSS variable theme
- **Responsive Layout** – Collapsible sidebar, adaptive grid/list
- **Modern Design** – Glassmorphism accents, smooth transitions, hover/active/disabled states
- **Custom Scrollbars** – Styled across browsers

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

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Run tests
npm test

# 4. Build for production
npm run build
```

## Architecture

```
src/
├── components/
│   ├── breadcrumb/      # Breadcrumb path navigation
│   ├── files/           # FileGrid, FileList, FileCard, FileRow
│   ├── graph/           # Canvas-based graph view
│   ├── layout/          # AppLayout (DnD wrapper), Sidebar
│   ├── modals/          # InputModal, ConfirmModal content
│   ├── preview/         # FilePreview, VideoPlayer, ImageViewer, PdfViewer
│   ├── toolbar/         # Toolbar (search, sort, upload, export, theme)
│   ├── tree/            # FolderTree (hierarchical sidebar)
│   └── ui/              # ContextMenu, Modal (reusable)
├── context/
│   ├── FileExplorerContext.jsx  # Central state (useReducer + async actions)
│   └── ModalContext.jsx         # Global modal management
├── hooks/
│   ├── useContextMenu.js        # Right-click menu logic
│   └── useDebounce.js           # Debounced value hook
├── services/
│   └── mockApi.js               # Mock REST API (localStorage-backed)
├── data/
│   └── initialData.json         # Default folder/file structure
├── theme/
│   ├── ThemeContext.jsx          # Light/Dark mode provider
│   └── theme.css                # CSS variables for both themes
└── utils/
    └── fileUtils.jsx            # File type detection, sorting, filtering, formatting
```

### State Management
All file operations flow through `FileExplorerContext` which uses `useReducer` for predictable state updates. Async operations (`createItem`, `deleteItem`, `renameItem`, `moveItem`) call the mock API, then refresh data from the source of truth.

### Mock API
`mockApi.js` simulates a REST backend with configurable latency. It persists data to `localStorage` and supports all CRUD operations. The `initialData.json` seeds the first load.

### JSON as Source of Truth
The entire folder/file hierarchy is maintained as a JSON tree. Any operation (create, delete, rename, move, upload) updates this JSON automatically. The **Export JSON** feature lets you download the structure at any folder level.

## Trade-offs

- **Mock Backend** – localStorage + in-memory ops instead of a real server; sufficient for demonstrating async patterns
- **Move Logic** – Uses `updateItem` with parent reassignment; a production app would use a dedicated move endpoint
- **Graph View** – Basic canvas rendering; React Flow would provide richer interactivity at the cost of bundle size
- **PDF Viewer** – Depends on `react-pdf` which requires a PDF.js worker; adds ~1MB to dependencies
- **Test Coverage** – Focused on utils, hooks, and API layer (38 tests); component-level tests would require more mocking infrastructure

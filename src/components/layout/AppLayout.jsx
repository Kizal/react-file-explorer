import { useState, useEffect } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Sidebar from './Sidebar';
import Toolbar from '../toolbar/Toolbar';
import Breadcrumb from '../breadcrumb/Breadcrumb';
import FileGrid from '../files/FileGrid';
import FileList from '../files/FileList';
import GraphView from '../graph/GraphView';
import FilePreview from '../preview/FilePreview';
import { useFileExplorer } from '../../context/FileExplorerContext';

// Sensor to prevent dnd-kit from blocking context menu interactions
class LeftClickOnlySensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({ nativeEvent: event }) => {
        // Only activate on primary button (left-click = button 0)
        if (event.button !== 0) return false;
        // Don't activate on interactive elements
        if (event.target?.closest?.('button, input, textarea, select, [contenteditable]')) return false;
        return true;
      },
    },
  ];
}

const AppLayout = () => {
  const { state, dispatch, moveItem, refreshData } = useFileExplorer();
  const [showPreview, setShowPreview] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState(null);

  // Auto-open preview when a file is selected
  useEffect(() => {
    if (state.selectedFileIds.length > 0) {
      setShowPreview(true);
    }
  }, [state.selectedFileIds]);

  const sensors = useSensors(
    useSensor(LeftClickOnlySensor, {
      activationConstraint: {
        distance: 8,
      }
    })
  );

  const handleDragStart = (event) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (over && active.id !== over.id) {
      const overData = over.data.current;
      if (overData?.type === 'folder') {
        moveItem(active.id, over.id);
      }
    }
  };

  const renderView = () => {
    switch (state.viewMode) {
      case 'grid':
        return <FileGrid />;
      case 'list':
        return <FileList />;
      case 'graph':
        return <GraphView />;
      default:
        return <FileGrid />;
    }
  };

  const hasSelection = state.selectedFileIds.length > 0;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <aside className="hidden md:flex w-[260px] flex-col border-r border-border shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <header className="px-5 border-b border-border sticky top-0 z-10 shrink-0 h-14 flex items-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <Toolbar
              showPreview={showPreview}
              setShowPreview={setShowPreview}
            />
          </header>

          <div className="px-5 py-1.5 border-b border-border-subtle shrink-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Breadcrumb />
          </div>

          <div
            className="flex-1 overflow-y-auto p-5 relative"
            onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
            onContextMenu={(e) => e.preventDefault()}
          >
            {state.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10"
                style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.85 }}>
                <div className="flex flex-col items-center gap-3">
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    border: '3px solid var(--border)',
                    borderTopColor: 'var(--accent)',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</span>
                </div>
              </div>
            )}
            {state.error && (
              <div className="mb-4 p-3 rounded-xl flex items-center justify-between"
                style={{ backgroundColor: 'var(--danger-subtle)', border: '1px solid var(--danger)' }}>
                <span className="text-[13px] font-medium" style={{ color: 'var(--danger)' }}>
                  Error: {state.error}
                </span>
                <button
                  onClick={refreshData}
                  className="text-[12px] font-bold px-3 py-1 rounded-lg border-0 cursor-pointer"
                  style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
                >
                  Retry
                </button>
              </div>
            )}
            {renderView()}
          </div>
        </main>

        {/* Preview Panel */}
        <aside
          className={`transition-all duration-300 ease-in-out flex flex-col shrink-0
                        ${showPreview ? 'w-[360px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
          style={{
            backgroundColor: 'var(--panel-bg)',
            borderLeft: showPreview ? '1px solid var(--border)' : 'none',
          }}
        >
          {showPreview && hasSelection ? (
            <FilePreview fileId={state.selectedFileIds[0]} onClose={() => setShowPreview(false)} />
          ) : showPreview ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--panel-section-bg)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>No file selected</p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>Click a file to see its details</p>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white shadow-xl border border-white/10"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              backdropFilter: 'blur(12px)',
            }}>
            {activeDragItem.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default AppLayout;

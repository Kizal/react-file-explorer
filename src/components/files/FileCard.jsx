import { useCallback } from 'react';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { getFileIcon, formatFileSize } from '../../utils/fileUtils';
import { useDraggable, useDroppable } from '@dnd-kit/core';

const FileCard = ({ file, onContextMenu }) => {
    const { state, dispatch, navigateToFolder } = useFileExplorer();
    const isSelected = state.selectedFileIds.includes(file.id);

    const { attributes, listeners, setNodeRef: setDraggableRef, isDragging } = useDraggable({
        id: file.id,
        data: file
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: file.id,
        data: file,
        disabled: file.type !== 'folder'
    });

    const setNodeRef = useCallback((node) => {
        setDraggableRef(node);
        setDroppableRef(node);
    }, [setDraggableRef, setDroppableRef]);

    const { onPointerDown: dndPointerDown, ...otherListeners } = listeners || {};

    const handlePointerDown = (e) => {
        // Only allow drag on left click (button 0)
        if (e.button === 0 && dndPointerDown) {
            dndPointerDown(e);
        }
    };

    const handleContextMenuEvent = (e) => {
        // Always prevent default native menu
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, file);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_FILE', payload: file.id });
    };

    const handleDoubleClick = (e) => {
        e.stopPropagation();
        if (file.type === 'folder') {
            navigateToFolder(file.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            {...otherListeners}
            {...attributes}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenuEvent}
            onAuxClick={(e) => {
                // Chrome sometimes fires auxclick for right button (button 2)
                if (e.button === 2) {
                    handleContextMenuEvent(e);
                }
            }}
            className={`
                group flex flex-col items-center justify-between rounded-xl cursor-pointer
                transition-all duration-200 w-[136px] h-[148px] text-center relative select-none
                ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}
                ${isOver ? 'bg-[var(--accent-subtle)] ring-2 ring-[var(--accent)]' : ''}
            `}
            style={{
                backgroundColor: isOver ? 'var(--accent-subtle)' : (isSelected ? 'var(--bg-selected)' : 'var(--card-bg)'),
                border: isOver ? '2px dashed var(--accent)' : `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--card-border)'}`,
                boxShadow: isSelected ? 'var(--card-selected-shadow)' : 'var(--card-shadow)',
                padding: '14px 10px 12px',
                zIndex: isOver ? 10 : 'auto'
            }}
            onMouseEnter={(e) => {
                if (!isSelected && !isOver) {
                    e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected && !isOver) {
                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            <div className="flex-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                {file.type === 'folder' ? (
                    <div className="text-[42px] drop-shadow-sm">📁</div>
                ) : (
                    <div className="text-text-secondary">{getFileIcon(file.fileType, 40)}</div>
                )}
            </div>

            <div className="w-full mt-1.5">
                <div className="text-[13px] font-semibold w-full truncate leading-tight"
                    style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {file.name}
                </div>
                <div className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                    style={{ color: 'var(--text-muted)' }}>
                    {file.type === 'folder' ?
                        `${file.children ? file.children.length : 0} items` :
                        formatFileSize(file.size)
                    }
                </div>
            </div>
        </div>
    );
};

export default FileCard;

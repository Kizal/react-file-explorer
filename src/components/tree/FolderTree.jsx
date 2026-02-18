import { useFileExplorer } from '../../context/FileExplorerContext';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

const FolderNode = ({ node, level = 0 }) => {
    const { state, navigateToFolder, dispatch } = useFileExplorer();
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = state.expandedFolders.includes(node.id);
    const isSelected = state.currentFolderId === node.id;
    const hasSubFolders = node.children && node.children.some(c => c.type === 'folder');

    const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
        id: node.id,
        data: node
    });

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: node.id,
        data: node
    });

    const setNodeRef = (el) => {
        setDragRef(el);
        setDropRef(el);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        dispatch({ type: 'TOGGLE_FOLDER_EXPAND', payload: node.id });
    };

    const handleClick = (e) => {
        e.stopPropagation();
        navigateToFolder(node.id);
    };

    if (node.type !== 'folder') return null;

    const itemCount = node.children ? node.children.length : 0;
    const indent = level * 16 + 8;

    // Determine row background
    let rowBg = 'transparent';
    if (isSelected) rowBg = 'var(--accent-subtle)';
    else if (isOver) rowBg = 'var(--accent-subtle)';
    else if (isHovered) rowBg = 'var(--sidebar-hover)';

    // Determine text color
    let textColor = 'var(--text-secondary)';
    if (isSelected) textColor = 'var(--accent)';
    else if (isHovered) textColor = 'var(--text-primary)';

    return (
        <div>
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: indent,
                    paddingRight: 10,
                    paddingTop: 7,
                    paddingBottom: 7,
                    marginBottom: 1,
                    cursor: 'pointer',
                    borderRadius: 6,
                    backgroundColor: rowBg,
                    borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                    opacity: isDragging ? 0.4 : 1,
                    transition: 'background-color 0.12s ease',
                    userSelect: 'none',
                    overflow: 'hidden',
                }}
            >
                {/* Chevron */}
                <div
                    onClick={handleToggle}
                    style={{
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: 4,
                        borderRadius: 4,
                        cursor: 'pointer',
                        visibility: hasSubFolders ? 'visible' : 'hidden',
                        color: textColor,
                    }}
                >
                    {isExpanded
                        ? <FiChevronDown size={12} strokeWidth={2.5} />
                        : <FiChevronRight size={12} strokeWidth={2.5} />
                    }
                </div>

                {/* Folder Icon */}
                <div style={{
                    flexShrink: 0,
                    marginRight: 8,
                    display: 'flex',
                    alignItems: 'center',
                    color: isSelected ? 'var(--accent)' : '#f0b429',
                }}>
                    {isExpanded ? <FaFolderOpen size={14} /> : <FaFolder size={14} />}
                </div>

                {/* Name */}
                <span style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: isSelected ? 700 : 500,
                    color: textColor,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                }}>
                    {node.name}
                </span>

                {/* Item Count Badge */}
                {itemCount > 0 && (
                    <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 4,
                        padding: '1px 6px',
                        marginLeft: 6,
                        flexShrink: 0,
                        backgroundColor: isSelected ? 'var(--accent)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#ffffff' : 'var(--text-muted)',
                        lineHeight: 1.4,
                    }}>
                        {itemCount}
                    </span>
                )}
            </div>

            {/* Children */}
            {isExpanded && node.children && (
                <div>
                    {node.children
                        .filter(child => child.type === 'folder')
                        .map(child => (
                            <FolderNode key={child.id} node={child} level={level + 1} />
                        ))}
                </div>
            )}
        </div>
    );
};

const FolderTree = () => {
    const { state } = useFileExplorer();
    const { files, isLoading } = state;

    if (isLoading && files.length === 0) {
        return (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                Loading folders...
            </div>
        );
    }

    return (
        <div>
            {files.map(node => (
                <FolderNode key={node.id} node={node} level={0} />
            ))}
        </div>
    );
};

export default FolderTree;

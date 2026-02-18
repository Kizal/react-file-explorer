import { useCallback, useRef } from 'react';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { sortFiles, filterFiles } from '../../utils/fileUtils';
import FileCard from './FileCard';
import ContextMenu from '../ui/ContextMenu';
import { useContextMenu } from '../../hooks/useContextMenu';
import { useModal } from '../../context/ModalContext';
import InputModalContent from '../modals/InputModalContent';
import ConfirmModalContent from '../modals/ConfirmModalContent';
import { FaFolder } from 'react-icons/fa';

const FileGrid = () => {
    const { state, dispatch, navigateToFolder, deleteItem, renameItem } = useFileExplorer();
    const { anchorPoint, show, selectedItem, handleContextMenu, setShow } = useContextMenu();
    const { openModal, closeModal } = useModal();
    const containerRef = useRef(null);

    const findFolder = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findFolder(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const currentFolder = findFolder(state.files, state.currentFolderId);
    let items = currentFolder ? currentFolder.children || [] : [];
    items = filterFiles(items, state.searchQuery);
    items = sortFiles(items, state.sortBy, state.sortOrder);

    const handleKeyDown = useCallback((e) => {
        if (!items.length) return;

        const selectedId = state.selectedFileIds[0];
        const currentIndex = items.findIndex(i => i.id === selectedId);

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown': {
                e.preventDefault();
                const next = Math.min(currentIndex + 1, items.length - 1);
                dispatch({ type: 'SELECT_FILE', payload: items[next >= 0 ? next : 0].id });
                break;
            }
            case 'ArrowLeft':
            case 'ArrowUp': {
                e.preventDefault();
                const prev = Math.max(currentIndex - 1, 0);
                dispatch({ type: 'SELECT_FILE', payload: items[prev].id });
                break;
            }
            case 'Enter': {
                e.preventDefault();
                const selected = items.find(i => i.id === selectedId);
                if (selected?.type === 'folder') navigateToFolder(selected.id);
                break;
            }
            case 'Delete': {
                e.preventDefault();
                const selected = items.find(i => i.id === selectedId);
                if (selected) {
                    openModal({
                        title: 'Delete Item',
                        content: (
                            <ConfirmModalContent
                                message={`Are you sure you want to delete "${selected.name}"?`}
                                confirmLabel="Delete"
                                isDanger={true}
                                onConfirm={() => { deleteItem(selected.id); closeModal(); }}
                                onCancel={closeModal}
                            />
                        )
                    });
                }
                break;
            }
            case 'F2': {
                e.preventDefault();
                const selected = items.find(i => i.id === selectedId);
                if (selected) {
                    openModal({
                        title: `Rename ${selected.name}`,
                        content: (
                            <InputModalContent
                                initialValue={selected.name}
                                submitLabel="Rename"
                                onSubmit={(newName) => { renameItem(selected.id, newName); closeModal(); }}
                                onCancel={closeModal}
                            />
                        )
                    });
                }
                break;
            }
            default:
                break;
        }
    }, [items, state.selectedFileIds, dispatch, navigateToFolder, deleteItem, renameItem, openModal, closeModal]);

    if (!items.length) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <FaFolder size={32} className="text-text-muted opacity-40" />
                </div>
                <div className="text-center">
                    <p className="text-[14px] font-medium text-text-secondary mb-1">No files found</p>
                    <p className="text-[12px] text-text-muted">This folder is empty or your search returned no results</p>
                </div>
                {state.searchQuery && (
                    <button
                        onClick={() => dispatch({ type: 'SET_SEARCH', payload: '' })}
                        className="text-[13px] font-semibold px-4 py-1.5 rounded-lg border-0 cursor-pointer"
                        style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
                    >
                        Clear Search
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            <div
                ref={containerRef}
                className="flex flex-wrap gap-4 pb-6"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                style={{ outline: 'none' }}
                role="grid"
                aria-label="File grid"
            >
                {items.map(item => (
                    <FileCard
                        key={item.id}
                        file={item}
                        onContextMenu={handleContextMenu}
                    />
                ))}
            </div>

            <ContextMenu
                anchorPoint={anchorPoint}
                show={show}
                selectedItem={selectedItem}
                onClose={() => setShow(false)}
            />
        </>
    );
};

export default FileGrid;

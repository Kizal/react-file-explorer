import { useFileExplorer } from '../../context/FileExplorerContext';
import { sortFiles, filterFiles } from '../../utils/fileUtils';
import FileRow from './FileRow';
import ContextMenu from '../ui/ContextMenu';
import { useContextMenu } from '../../hooks/useContextMenu';

const FileList = () => {
    const { state } = useFileExplorer();
    const { anchorPoint, show, selectedItem, handleContextMenu, setShow } = useContextMenu();

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

    if (!items.length) {
        return <div className="p-8 text-center text-text-muted text-[13px]">No items</div>;
    }

    return (
        <>
            <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}>
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                            <th className="py-2.5 px-4 w-1/2 text-left font-semibold text-[11px] uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>Name</th>
                            <th className="py-2.5 px-4 text-left font-semibold text-[11px] uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>Type</th>
                            <th className="py-2.5 px-4 text-left font-semibold text-[11px] uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>Size</th>
                            <th className="py-2.5 px-4 text-left font-semibold text-[11px] uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)' }}>Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <FileRow
                                key={item.id}
                                file={item}
                                onContextMenu={handleContextMenu}
                            />
                        ))}
                    </tbody>
                </table>
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

export default FileList;

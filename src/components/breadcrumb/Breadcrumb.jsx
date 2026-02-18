import { useFileExplorer } from '../../context/FileExplorerContext';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumb = () => {
    const { state, navigateToFolder, dispatch } = useFileExplorer();
    const { files, currentFolderId } = state;

    const findPath = (nodes, targetId, path = []) => {
        for (const node of nodes) {
            if (node.id === targetId) return [...path, node];
            if (node.children) {
                const found = findPath(node.children, targetId, [...path, node]);
                if (found) return found;
            }
        }
        return null;
    };

    const path = findPath(files, currentFolderId) || [];

    return (
        <div className="flex items-center gap-1 py-1">
            <button
                onClick={() => {
                    if (files.length > 0) navigateToFolder(files[0].id);
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[13px] font-medium transition-colors duration-150 border-0 cursor-pointer"
                style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
                <FaHome size={13} />
            </button>

            {path.map((item, index) => (
                <div key={item.id} className="flex items-center gap-1">
                    <FaChevronRight size={9} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                    <button
                        onClick={() => navigateToFolder(item.id)}
                        className={`px-2 py-1 rounded-md text-[13px] transition-colors duration-150 border-0 cursor-pointer ${index === path.length - 1 ? 'font-bold' : 'font-medium'
                            }`}
                        style={{
                            color: index === path.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                            backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = index === path.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)'; }}
                    >
                        {item.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Breadcrumb;

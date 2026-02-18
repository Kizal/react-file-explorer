import { useFileExplorer } from '../../context/FileExplorerContext';
import { getFileIcon, formatFileSize, formatDate } from '../../utils/fileUtils';

const FileRow = ({ file, onContextMenu }) => {
    const { state, dispatch, navigateToFolder } = useFileExplorer();
    const isSelected = state.selectedFileIds.includes(file.id);

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
        <tr
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={(e) => onContextMenu(e, file)}
            className="cursor-pointer group transition-colors duration-150"
            style={{
                backgroundColor: isSelected ? 'var(--bg-selected)' : 'transparent',
                borderBottom: '1px solid var(--border-subtle)',
            }}
            onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
            }}
        >
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        {file.type === 'folder' ? '📁' : getFileIcon(file.fileType, 18)}
                    </div>
                    <span className="text-[13px] font-semibold truncate"
                        style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {file.name}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {file.type === 'folder' ? (
                    <span className="text-[13px]">Folder</span>
                ) : (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide"
                        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                        {file.fileType}
                    </span>
                )}
            </td>
            <td className="py-3 px-4 text-[13px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                {file.type === 'folder' ? '—' : formatFileSize(file.size)}
            </td>
            <td className="py-3 px-4 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {formatDate(file.modified)}
            </td>
        </tr>
    );
};

export default FileRow;

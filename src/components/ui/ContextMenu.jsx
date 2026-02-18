import { useRef } from 'react';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { useModal } from '../../context/ModalContext';
import InputModalContent from '../modals/InputModalContent';
import ConfirmModalContent from '../modals/ConfirmModalContent';
import { FaFolderOpen, FaPen, FaTrash, FaDownload } from 'react-icons/fa';

const ContextMenu = ({ anchorPoint, show, selectedItem, onClose }) => {
    const { deleteItem, renameItem, navigateToFolder } = useFileExplorer();
    const { openModal, closeModal } = useModal();
    const menuRef = useRef(null);

    if (!show || !selectedItem) return null;

    const handleAction = (action) => {
        onClose();
        switch (action) {
            case 'open':
                if (selectedItem.type === 'folder') navigateToFolder(selectedItem.id);
                break;
            case 'rename':
                openModal({
                    title: `Rename ${selectedItem.name}`,
                    content: (
                        <InputModalContent
                            initialValue={selectedItem.name}
                            submitLabel="Rename"
                            onSubmit={(newName) => { renameItem(selectedItem.id, newName); closeModal(); }}
                            onCancel={closeModal}
                        />
                    )
                });
                break;
            case 'delete':
                openModal({
                    title: "Delete Item",
                    content: (
                        <ConfirmModalContent
                            message={`Are you sure you want to delete "${selectedItem.name}"? This action cannot be undone.`}
                            confirmLabel="Delete"
                            isDanger={true}
                            onConfirm={() => { deleteItem(selectedItem.id); closeModal(); }}
                            onCancel={closeModal}
                        />
                    )
                });
                break;
            case 'download':
                if (selectedItem.url) {
                    const link = document.createElement('a');
                    link.href = selectedItem.url;
                    link.download = selectedItem.name;
                    link.click();
                }
                break;
            default:
                break;
        }
    };

    const menuItems = [
        { action: 'open', icon: <FaFolderOpen size={12} />, label: 'Open', danger: false },
        { action: 'rename', icon: <FaPen size={11} />, label: 'Rename', danger: false },
        { action: 'delete', icon: <FaTrash size={11} />, label: 'Delete', danger: true },
    ];

    if (selectedItem.type === 'file') {
        menuItems.push({ divider: true });
        menuItems.push({ action: 'download', icon: <FaDownload size={11} />, label: 'Download', danger: false });
    }

    return (
        <ul
            ref={menuRef}
            style={{
                top: anchorPoint.y,
                left: anchorPoint.x,
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
                backdropFilter: 'blur(16px)',
            }}
            className="fixed rounded-xl list-none min-w-[200px] z-50 py-1.5"
            onContextMenu={(e) => e.preventDefault()}
        >
            {menuItems.map((item, i) => {
                if (item.divider) {
                    return <li key={i} className="my-1 mx-3" style={{ borderTop: '1px solid var(--border-subtle)' }}></li>;
                }
                return (
                    <li
                        key={item.action}
                        onClick={() => handleAction(item.action)}
                        className="px-3 py-2 mx-1.5 cursor-pointer rounded-lg text-[13px] font-medium flex items-center gap-2.5 transition-colors duration-150"
                        style={{
                            color: item.danger ? 'var(--danger)' : 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = item.danger ? 'var(--danger-subtle)' : 'var(--bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        role="button"
                    >
                        <span className="opacity-60">{item.icon}</span>
                        {item.label}
                    </li>
                );
            })}
        </ul>
    );
};

export default ContextMenu;

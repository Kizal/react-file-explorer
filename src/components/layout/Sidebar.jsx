import { FaCompactDisc, FaPlus } from 'react-icons/fa';
import FolderTree from '../tree/FolderTree';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { useModal } from '../../context/ModalContext';
import InputModalContent from '../modals/InputModalContent';

const Sidebar = () => {
    const { createFolder, state } = useFileExplorer();
    const { openModal, closeModal } = useModal();

    const handleNewFolder = () => {
        openModal({
            title: 'New Root Folder',
            content: (
                <InputModalContent
                    placeholder="Folder name"
                    submitLabel="Create Folder"
                    onSubmit={(name) => {
                        createFolder(null, name);
                        closeModal();
                    }}
                    onCancel={closeModal}
                />
            )
        });
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--sidebar-bg)',
            overflow: 'hidden',
        }}>
            {/* ─── Brand Header ─── */}
            <div style={{
                height: 56,
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexShrink: 0,
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--sidebar-header-bg)',
            }}>
                <div style={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                    boxShadow: '0 2px 8px rgba(91, 95, 199, 0.3)',
                    flexShrink: 0,
                }}>
                    <FaCompactDisc size={17} color="#ffffff" />
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                    }}>CloudSpace</div>
                    <div style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        lineHeight: 1.2,
                    }}>File Manager</div>
                </div>
            </div>

            {/* ─── Explorer Section ─── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                {/* Section Label */}
                <div style={{
                    padding: '16px 16px 8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                    }}>Explorer</span>
                    <div style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        opacity: 0.6,
                    }} />
                </div>

                {/* Folder Tree — scrollable */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '0 8px 8px 8px',
                }}>
                    <FolderTree />
                </div>
            </div>

            {/* ─── Footer: Storage + New Folder ─── */}
            <div style={{
                padding: 16,
                borderTop: '1px solid var(--border)',
                flexShrink: 0,
            }}>


                {/* New Folder Button */}
                <button
                    onClick={handleNewFolder}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                        color: '#ffffff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: '0 2px 8px rgba(91, 95, 199, 0.25)',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 95, 199, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(91, 95, 199, 0.25)';
                    }}
                >
                    <FaPlus size={10} /> New Root Folder
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

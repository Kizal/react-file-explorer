import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    const [closeHovered, setCloseHovered] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'modalFadeIn 0.2s ease-out',
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 440,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2), 0 12px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.05) inset',
                animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border)',
                }}>
                    <h3 style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        letterSpacing: '-0.01em',
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        onMouseEnter={() => setCloseHovered(true)}
                        onMouseLeave={() => setCloseHovered(false)}
                        style={{
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 8,
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            backgroundColor: closeHovered ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                            color: closeHovered ? 'var(--text-primary)' : 'var(--text-muted)',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <FiX size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '24px',
                    overflowY: 'auto',
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                        borderTop: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '0 0 16px 16px',
                    }}>
                        {footer}
                    </div>
                )}
            </div>

            {/* Keyframe Animations */}
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
};

export default Modal;

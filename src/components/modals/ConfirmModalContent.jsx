import { useState } from 'react';

const ConfirmModalContent = ({ message, onConfirm, onCancel, confirmLabel = 'Confirm', isDanger = false }) => {
    const [cancelHovered, setCancelHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

    const gradientColors = isDanger
        ? 'linear-gradient(135deg, var(--danger), var(--danger-hover))'
        : 'linear-gradient(135deg, var(--accent), var(--accent-hover))';

    const shadowColor = isDanger
        ? 'rgba(229, 57, 53, 0.25)'
        : 'rgba(91, 95, 199, 0.25)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0,
            }}>
                {message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                {/* Cancel */}
                <button
                    onClick={onCancel}
                    onMouseEnter={() => setCancelHovered(true)}
                    onMouseLeave={() => setCancelHovered(false)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        backgroundColor: cancelHovered ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                        transition: 'background-color 0.15s ease',
                    }}
                >
                    Cancel
                </button>

                {/* Confirm */}
                <button
                    onClick={onConfirm}
                    onMouseEnter={() => setConfirmHovered(true)}
                    onMouseLeave={() => setConfirmHovered(false)}
                    style={{
                        padding: '10px 24px',
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        color: '#ffffff',
                        background: gradientColors,
                        boxShadow: confirmHovered
                            ? `0 4px 12px ${shadowColor}`
                            : `0 2px 6px ${shadowColor}`,
                        transform: confirmHovered ? 'translateY(-1px)' : 'translateY(0)',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    );
};

export default ConfirmModalContent;

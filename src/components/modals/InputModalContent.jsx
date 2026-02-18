import { useState, useEffect, useRef } from 'react';

const InputModalContent = ({ initialValue = '', placeholder = '', onSubmit, onCancel, submitLabel = 'Confirm' }) => {
    const [value, setValue] = useState(initialValue);
    const [inputFocused, setInputFocused] = useState(false);
    const [cancelHovered, setCancelHovered] = useState(false);
    const [submitHovered, setSubmitHovered] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
        }
    };

    const canSubmit = value.trim().length > 0;

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <label style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: 8,
                }}>
                    Name
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `1.5px solid ${inputFocused ? 'var(--accent)' : 'var(--border)'}`,
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxShadow: inputFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                {/* Cancel Button */}
                <button
                    type="button"
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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!canSubmit}
                    onMouseEnter={() => setSubmitHovered(true)}
                    onMouseLeave={() => setSubmitHovered(false)}
                    style={{
                        padding: '10px 24px',
                        borderRadius: 10,
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: 'inherit',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        color: '#ffffff',
                        background: canSubmit
                            ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))'
                            : 'var(--bg-tertiary)',
                        opacity: canSubmit ? 1 : 0.4,
                        boxShadow: canSubmit && submitHovered
                            ? '0 4px 12px rgba(91, 95, 199, 0.35)'
                            : canSubmit
                                ? '0 2px 8px rgba(91, 95, 199, 0.2)'
                                : 'none',
                        transform: canSubmit && submitHovered ? 'translateY(-1px)' : 'translateY(0)',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
};

export default InputModalContent;

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';

const ImageViewer = ({ src, alt }) => {
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = (e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.25, 3)); };
    const handleZoomOut = (e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.25, 0.5)); };
    const handleReset = (e) => { e.stopPropagation(); setZoom(1); };

    return (
        <>
            {/* Inline Preview */}
            <div style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => { setShowFullscreen(true); setZoom(1); }}>
                <img
                    src={src}
                    alt={alt}
                    style={{
                        maxWidth: '100%',
                        maxHeight: 360,
                        objectFit: 'contain',
                        borderRadius: 12,
                        boxShadow: 'var(--shadow-md)',
                        display: 'block',
                        margin: '0 auto',
                    }}
                />
                <div style={{
                    position: 'absolute', bottom: 8, right: 8,
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', opacity: 0.8, transition: 'opacity 0.15s',
                }}>
                    <FiMaximize size={14} />
                </div>
            </div>

            {/* Fullscreen Modal */}
            {showFullscreen && createPortal(
                <div
                    onClick={() => setShowFullscreen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'modalFadeIn 0.2s ease-out',
                    }}
                >
                    {/* Toolbar */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute', top: 16, right: 16,
                            display: 'flex', gap: 8, zIndex: 101,
                        }}
                    >
                        <button onClick={handleZoomOut} style={btnStyle} aria-label="Zoom Out">
                            <FiZoomOut size={18} />
                        </button>
                        <button onClick={handleReset} style={{ ...btnStyle, fontSize: 12, fontWeight: 600, minWidth: 48 }}>
                            {Math.round(zoom * 100)}%
                        </button>
                        <button onClick={handleZoomIn} style={btnStyle} aria-label="Zoom In">
                            <FiZoomIn size={18} />
                        </button>
                        <button onClick={() => setShowFullscreen(false)} style={btnStyle} aria-label="Close">
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Image */}
                    <img
                        src={src}
                        alt={alt}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            transform: `scale(${zoom})`,
                            transition: 'transform 0.2s ease',
                            borderRadius: 8,
                        }}
                    />

                    {/* Caption */}
                    <div style={{
                        position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                        color: '#fff', fontSize: 13, fontWeight: 600,
                        backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 16px',
                        borderRadius: 8, backdropFilter: 'blur(8px)',
                    }}>
                        {alt}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

const btnStyle = {
    backgroundColor: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 0,
    width: 36, height: 36,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', cursor: 'pointer',
    transition: 'background-color 0.15s ease',
};

export default ImageViewer;

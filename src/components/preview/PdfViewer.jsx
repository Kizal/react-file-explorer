import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut } from 'react-icons/fi';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ url, name }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = (err) => {
        setError(err.message);
        setLoading(false);
    };

    const goToPrev = () => setPageNumber(p => Math.max(1, p - 1));
    const goToNext = () => setPageNumber(p => Math.min(numPages || 1, p + 1));
    const zoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
    const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));

    if (error) {
        return (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--danger)', fontSize: 13 }}>
                Could not load PDF: {error}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '8px 12px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--panel-section-bg)',
                borderRadius: '12px 12px 0 0',
                flexShrink: 0,
            }}>
                <button onClick={goToPrev} disabled={pageNumber <= 1} style={ctrlBtn}>
                    <FiChevronLeft size={14} />
                </button>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 60, textAlign: 'center' }}>
                    {pageNumber} / {numPages || '—'}
                </span>
                <button onClick={goToNext} disabled={pageNumber >= (numPages || 1)} style={ctrlBtn}>
                    <FiChevronRight size={14} />
                </button>
                <div style={{ width: 1, height: 20, backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />
                <button onClick={zoomOut} style={ctrlBtn}><FiZoomOut size={14} /></button>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', minWidth: 36, textAlign: 'center' }}>
                    {Math.round(scale * 100)}%
                </span>
                <button onClick={zoomIn} style={ctrlBtn}><FiZoomIn size={14} /></button>
            </div>

            {/* PDF Content */}
            <div style={{
                flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center',
                padding: 12, backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '0 0 12px 12px',
            }}>
                {loading && (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        Loading PDF...
                    </div>
                )}
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading=""
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </div>
        </div>
    );
};

const ctrlBtn = {
    width: 28, height: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', borderRadius: 6, padding: 0,
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
};

export default PdfViewer;

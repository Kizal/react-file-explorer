import { useState, useEffect } from 'react';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { getFileIcon, formatFileSize, formatDate } from '../../utils/fileUtils';
import { FaTimes, FaDownload, FaFile, FaCalendar, FaHdd, FaTag } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';
import ImageViewer from './ImageViewer';
import PdfViewer from './PdfViewer';

const TextPreview = ({ file }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(file.url);
                if (!response.ok) throw new Error('Failed to load');
                const text = await response.text();
                setContent(text);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (file.url) fetchContent();
    }, [file.url]);

    if (loading) return <div className="p-6 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>Loading...</div>;
    if (error) return <div className="p-6 text-center text-[13px]" style={{ color: 'var(--danger)' }}>Error: {error}</div>;

    return (
        <div className="mx-4 p-4 rounded-xl overflow-auto max-h-[360px]"
            style={{ backgroundColor: 'var(--panel-section-bg)', border: '1px solid var(--border-subtle)' }}>
            <pre className="m-0 whitespace-pre-wrap font-mono text-[12px] leading-relaxed"
                style={{ color: 'var(--text-primary)' }}>
                {content}
            </pre>
        </div>
    );
};

const FilePreview = ({ fileId, onClose }) => {
    const { state } = useFileExplorer();

    const findFile = (items, id) => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findFile(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const file = findFile(state.files, fileId);
    if (!file) return null;

    const renderPreviewContent = () => {
        switch (file.fileType) {
            case 'image':
                return (
                    <div className="p-4">
                        <ImageViewer src={file.url} alt={file.name} />
                    </div>
                );
            case 'video':
                return (
                    <div className="p-4">
                        <VideoPlayer src={file.url} name={file.name} />
                    </div>
                );
            case 'pdf':
                return (
                    <div className="p-4" style={{ height: 400 }}>
                        <PdfViewer url={file.url} name={file.name} />
                    </div>
                );
            case 'text':
            case 'code':
                return <TextPreview file={file} />;
            default:
                return (
                    <div className="p-8 text-center flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--panel-section-bg)' }}>
                            {getFileIcon(file.fileType, 32)}
                        </div>
                        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>No preview available</p>
                    </div>
                );
        }
    };

    const metaItems = [
        { icon: <FaTag size={12} />, label: 'Type', value: file.fileType || file.type },
        { icon: <FaHdd size={12} />, label: 'Size', value: file.type === 'folder' ? `${file.children?.length || 0} items` : formatFileSize(file.size) },
        { icon: <FaCalendar size={12} />, label: 'Modified', value: formatDate(file.modified) },
    ];

    const handleDownload = async () => {
        if (!file) return;

        try {
            if (file.url) {
                const isBlob = file.url.startsWith('blob:');

                if (isBlob) {
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    return;
                }

                try {
                    const response = await fetch(file.url);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (err) {
                    console.warn("CORS/Fetch failed, falling back to direct link", err);
                    window.open(file.url, '_blank');
                }
            } else {
                const content = file.content || `This is a mock file content for: ${file.name}\n\nSize: ${file.size}\nModified: ${new Date(file.modified).toLocaleString()}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error("Download failed", e);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-14 px-5 border-b flex justify-between items-center shrink-0"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--panel-bg)' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--panel-section-bg)' }}>
                        <FaFile size={12} className="text-text-muted" />
                    </div>
                    <h3 className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {file.name}
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-md transition-colors duration-150 border-0 cursor-pointer"
                    style={{ color: 'var(--text-muted)', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                    <FaTimes size={13} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {renderPreviewContent()}

                {/* Metadata */}
                <div className="p-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold mb-3"
                        style={{ color: 'var(--text-muted)' }}>
                        Details
                    </h4>
                    <div className="flex flex-col gap-2">
                        {metaItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg"
                                style={{ backgroundColor: 'var(--panel-section-bg)' }}>
                                <div className="flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] uppercase tracking-widest font-semibold"
                                        style={{ color: 'var(--text-muted)' }}>
                                        {item.label}
                                    </div>
                                    <div className="text-[13px] font-semibold truncate"
                                        style={{ color: 'var(--text-primary)' }}>
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] border-0 cursor-pointer text-white transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', boxShadow: 'var(--shadow-sm)' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    <FaDownload size={13} /> Download
                </button>
            </div>
        </div>
    );
};

export default FilePreview;

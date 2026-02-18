import { FiGrid, FiList, FiShare2, FiSearch, FiUpload, FiFilter, FiMoon, FiSun, FiDownload, FiSidebar, FiCode } from 'react-icons/fi';
import { useFileExplorer } from '../../context/FileExplorerContext';
import { useTheme } from '../../theme/ThemeContext';
import { useState, useCallback } from 'react';

/* Shared base style for icon buttons — overrides global button CSS */
const iconBtnBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, transform 0.15s ease',
};

const Toolbar = ({ showPreview, setShowPreview }) => {
    const { state, dispatch, uploadFile, getFileById, exportJSON } = useFileExplorer();
    const { theme, toggleTheme } = useTheme();
    const [searchInput, setSearchInput] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [hovered, setHovered] = useState(null); // track which button is hovered

    const handleSearch = useCallback((e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
            dispatch({ type: 'SET_SEARCH', payload: value });
        }, 300);
        setSearchTimeout(timeout);
    }, [dispatch, searchTimeout]);

    const handleUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => uploadFile(state.currentFolderId, file));
        };
        input.click();
    };

    const handleExportJSON = () => {
        const data = exportJSON(state.currentFolderId);
        if (!data) return;
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name || 'file-explorer'}-structure.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownload = async () => {
        if (state.selectedFileIds.length === 0) return;

        for (const id of state.selectedFileIds) {
            const file = getFileById(id);
            if (file && file.type !== 'folder') {
                try {
                    // 1. If we have a URL (blob or external), try to use it
                    if (file.url) {
                        const isBlob = file.url.startsWith('blob:');

                        // For blob URLs (uploads), simple download works perfectly
                        if (isBlob) {
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.name;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            continue;
                        }

                        // For external URLs (mock data), try to fetch as blob to force download
                        // (This might fail due to CORS on some external links, fallback to direct open)
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
                        // 2. Fallback for mock files without URL: generate dummy content
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
            }
        }
    };

    const handleSort = (sortBy) => {
        dispatch({ type: 'SET_SORT', payload: { sortBy } });
    };

    const viewModes = [
        { mode: 'grid', Icon: FiGrid, label: 'Grid View' },
        { mode: 'list', Icon: FiList, label: 'List View' },
        { mode: 'graph', Icon: FiShare2, label: 'Graph View' },
    ];

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>

            {/* ─── View Mode Toggles ─── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--bg-tertiary)', padding: 4, borderRadius: 12 }}>
                {viewModes.map(({ mode, Icon, label }) => {
                    const isActive = state.viewMode === mode;
                    const isHov = hovered === `view-${mode}`;
                    return (
                        <button
                            key={mode}
                            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
                            title={label}
                            onMouseEnter={() => setHovered(`view-${mode}`)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                                ...iconBtnBase,
                                width: 32,
                                height: 32,
                                background: isActive
                                    ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))'
                                    : isHov ? 'var(--bg-hover)' : 'transparent',
                            }}
                        >
                            <Icon
                                size={15}
                                color={isActive ? '#ffffff' : isHov ? 'var(--text-primary)' : 'var(--text-secondary)'}
                                strokeWidth={2.5}
                            />
                        </button>
                    );
                })}
            </div>

            {/* ─── Search Bar ─── */}
            <div style={{ position: 'relative', flex: '1 1 0', maxWidth: 420 }}>
                <FiSearch
                    size={14}
                    color="var(--text-muted)"
                    strokeWidth={2}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchInput}
                    onChange={handleSearch}
                    style={{
                        width: '100%',
                        paddingLeft: 36,
                        paddingRight: 12,
                        paddingTop: 8,
                        paddingBottom: 8,
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: 13,
                        outline: 'none',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--border-subtle)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            {/* ─── Action Buttons ─── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Upload */}
                <button
                    onClick={handleUpload}
                    title="Upload File"
                    onMouseEnter={() => setHovered('upload')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        ...iconBtnBase,
                        backgroundColor: hovered === 'upload' ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                    }}
                >
                    <FiUpload
                        size={15}
                        color={hovered === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)'}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Sort */}
                <div style={{ position: 'relative' }}>
                    <button
                        title="Sort By"
                        onMouseEnter={() => setHovered('sort')}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            ...iconBtnBase,
                            backgroundColor: hovered === 'sort' ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                        }}
                    >
                        <FiFilter
                            size={15}
                            color={hovered === 'sort' ? 'var(--text-primary)' : 'var(--text-secondary)'}
                            strokeWidth={2.5}
                        />
                    </button>
                    <select
                        onChange={(e) => handleSort(e.target.value)}
                        value={state.sortBy}
                        title="Sort by"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                    >
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                        <option value="modified">Modified</option>
                        <option value="type">Type</option>
                    </select>
                </div>

                {/* Download */}
                <button
                    onClick={handleDownload}
                    title="Download Selection"
                    disabled={state.selectedFileIds.length === 0}
                    onMouseEnter={() => setHovered('download')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        ...iconBtnBase,
                        backgroundColor: hovered === 'download' ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                        opacity: state.selectedFileIds.length === 0 ? 0.4 : 1,
                    }}
                >
                    <FiDownload
                        size={15}
                        color={hovered === 'download' ? 'var(--text-primary)' : 'var(--text-secondary)'}
                        strokeWidth={2.5}
                    />
                </button>

                {/* Export JSON */}
                <button
                    onClick={handleExportJSON}
                    title="Export JSON"
                    onMouseEnter={() => setHovered('export')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        ...iconBtnBase,
                        backgroundColor: hovered === 'export' ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                    }}
                >
                    <FiCode
                        size={15}
                        color={hovered === 'export' ? 'var(--text-primary)' : 'var(--text-secondary)'}
                        strokeWidth={2.5}
                    />
                </button>
            </div>

            {/* ─── Spacer ─── */}
            <div style={{ flex: 1 }} />

            {/* ─── Right-hand Actions ─── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    onMouseEnter={() => setHovered('theme')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        ...iconBtnBase,
                        backgroundColor: hovered === 'theme' ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                    }}
                >
                    {theme === 'dark' ? (
                        <FiSun size={16} color="#fbbf24" strokeWidth={2.5} />
                    ) : (
                        <FiMoon size={16} color={hovered === 'theme' ? 'var(--text-primary)' : 'var(--text-secondary)'} strokeWidth={2.5} />
                    )}
                </button>

                {/* Preview Panel Toggle */}
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    title="Toggle Preview Panel"
                    onMouseEnter={() => setHovered('preview')}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                        ...iconBtnBase,
                        backgroundColor: showPreview
                            ? (hovered === 'preview' ? 'var(--accent-glow)' : 'var(--accent-subtle)')
                            : (hovered === 'preview' ? 'var(--bg-hover)' : 'var(--bg-tertiary)'),
                    }}
                >
                    <FiSidebar
                        size={16}
                        color={showPreview ? 'var(--accent)' : (hovered === 'preview' ? 'var(--text-primary)' : 'var(--text-secondary)')}
                        strokeWidth={2.5}
                        style={{ transform: 'scaleX(-1)' }}
                    />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;

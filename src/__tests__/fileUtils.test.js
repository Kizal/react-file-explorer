import { describe, it, expect } from 'vitest';
import { getFileType, formatFileSize, sortFiles, filterFiles, formatDate } from '../utils/fileUtils';

describe('getFileType', () => {
    it('detects image types', () => {
        expect(getFileType('photo.jpg')).toBe('image');
        expect(getFileType('photo.jpeg')).toBe('image');
        expect(getFileType('photo.png')).toBe('image');
        expect(getFileType('photo.webp')).toBe('image');
        expect(getFileType('photo.gif')).toBe('image');
        expect(getFileType('photo.svg')).toBe('image');
    });

    it('detects video types', () => {
        expect(getFileType('clip.mp4')).toBe('video');
        expect(getFileType('clip.webm')).toBe('video');
        expect(getFileType('clip.ogg')).toBe('video');
        expect(getFileType('clip.mov')).toBe('video');
    });

    it('detects pdf type', () => {
        expect(getFileType('doc.pdf')).toBe('pdf');
    });

    it('detects archive types', () => {
        expect(getFileType('data.zip')).toBe('archive');
        expect(getFileType('data.rar')).toBe('archive');
        expect(getFileType('data.tar')).toBe('archive');
    });

    it('detects code types', () => {
        expect(getFileType('script.js')).toBe('code');
        expect(getFileType('app.jsx')).toBe('code');
        expect(getFileType('styles.css')).toBe('code');
        expect(getFileType('page.html')).toBe('code');
        expect(getFileType('data.json')).toBe('code');
    });

    it('returns other for unknown types', () => {
        expect(getFileType('unknown.xyz')).toBe('other');
        expect(getFileType('document.doc')).toBe('other');
        expect(getFileType('noext')).toBe('other');
    });

    it('handles case insensitivity', () => {
        expect(getFileType('image.PNG')).toBe('image');
        expect(getFileType('video.MP4')).toBe('video');
    });
});

describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
        expect(formatFileSize(0)).toBe('0 B');
        expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats kilobytes correctly', () => {
        expect(formatFileSize(1024)).toBe('1 KB');
        expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('formats megabytes correctly', () => {
        expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('formats gigabytes correctly', () => {
        expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('handles undefined/null gracefully', () => {
        expect(formatFileSize(undefined)).toBeDefined();
        expect(formatFileSize(null)).toBeDefined();
    });
});

describe('sortFiles', () => {
    const files = [
        { name: 'b.txt', type: 'file', size: 100, modified: 2000 },
        { name: 'a.txt', type: 'file', size: 200, modified: 1000 },
        { name: 'Folder', type: 'folder', size: 0, modified: 3000 }
    ];

    it('sorts by name ascending with folders first', () => {
        const sorted = sortFiles(files, 'name', 'asc');
        expect(sorted[0].name).toBe('Folder');
        expect(sorted[1].name).toBe('a.txt');
        expect(sorted[2].name).toBe('b.txt');
    });

    it('sorts by name descending with folders first', () => {
        const sorted = sortFiles(files, 'name', 'desc');
        expect(sorted[0].name).toBe('Folder');
        expect(sorted[1].name).toBe('b.txt');
        expect(sorted[2].name).toBe('a.txt');
    });

    it('sorts by size ascending with folders first', () => {
        const sorted = sortFiles(files, 'size', 'asc');
        expect(sorted[0].type).toBe('folder');
    });

    it('sorts by size descending', () => {
        const sorted = sortFiles(files, 'size', 'desc');
        expect(sorted[0].type).toBe('folder');
        expect(sorted[1].size).toBeGreaterThanOrEqual(sorted[2].size);
    });

    it('sorts by date', () => {
        const sorted = sortFiles(files, 'date', 'desc');
        expect(sorted[0].type).toBe('folder');
    });

    it('handles empty array', () => {
        expect(sortFiles([], 'name', 'asc')).toEqual([]);
    });
});

describe('filterFiles', () => {
    const files = [
        { name: 'readme.txt', type: 'file' },
        { name: 'package.json', type: 'file' },
        { name: 'Documents', type: 'folder' },
    ];

    it('filters by name match', () => {
        const result = filterFiles(files, 'read');
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('readme.txt');
    });

    it('returns all items with empty query', () => {
        expect(filterFiles(files, '').length).toBe(3);
    });

    it('is case-insensitive', () => {
        expect(filterFiles(files, 'README').length).toBe(1);
    });

    it('returns empty for no matches', () => {
        expect(filterFiles(files, 'zzzzz').length).toBe(0);
    });
});

describe('formatDate', () => {
    it('formats a timestamp', () => {
        const result = formatDate(1709251200000);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    it('handles undefined gracefully', () => {
        const result = formatDate(undefined);
        expect(typeof result).toBe('string');
    });
});

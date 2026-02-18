import { FaFileImage, FaFilePdf, FaFileVideo, FaFileAlt, FaFileArchive, FaFileCode } from 'react-icons/fa';

export const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'xml'].includes(ext)) return 'code';
  if (['txt', 'md', 'csv', 'log'].includes(ext)) return 'text';

  return 'other';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
};

export const getFileIcon = (fileType, size = 24) => {
  switch (fileType) {
    case 'image': return <FaFileImage size={size} color="#f59e0b" />;
    case 'video': return <FaFileVideo size={size} color="#ef4444" />;
    case 'pdf': return <FaFilePdf size={size} color="#ef4444" />;
    case 'archive': return <FaFileArchive size={size} color="#6366f1" />;
    case 'code': return <FaFileCode size={size} color="#3b82f6" />;
    default: return <FaFileAlt size={size} color="#9ca3af" />;
  }
};

export const sortFiles = (files, sortBy, order) => {
  const multiplier = order === 'asc' ? 1 : -1;

  return [...files].sort((a, b) => {
    // Always put folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }

    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return -1 * multiplier;
    if (valA > valB) return 1 * multiplier;
    return 0;
  });
};

export const filterFiles = (files, query) => {
  if (!query) return files;
  const lowerQuery = query.toLowerCase();
  return files.filter(file => file.name.toLowerCase().includes(lowerQuery));
};

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { formatFileSize } from '../utils/fileUtils';

const FileExplorerContext = createContext();

const initialState = {
    files: [],
    currentFolderId: '1',
    selectedFileIds: [],
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
    isLoading: false,
    error: null,
    expandedFolders: ['1'],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, files: action.payload, isLoading: false, error: null };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_CURRENT_FOLDER':
            return { ...state, currentFolderId: action.payload, selectedFileIds: [] };
        case 'SET_VIEW_MODE':
            return { ...state, viewMode: action.payload };
        case 'SET_SORT':
            return { ...state, sortBy: action.payload.by, sortOrder: action.payload.order };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        case 'TOGGLE_FOLDER_EXPAND':
            const isExpanded = state.expandedFolders.includes(action.payload);
            return {
                ...state,
                expandedFolders: isExpanded
                    ? state.expandedFolders.filter(id => id !== action.payload)
                    : [...state.expandedFolders, action.payload]
            };
        case 'SELECT_FILE':
            // Multi-select logic could go here, for now single select for simplicity unless ctrl key
            return { ...state, selectedFileIds: [action.payload] };
        case 'CLEAR_SELECTION':
            return { ...state, selectedFileIds: [] };
        default:
            return state;
    }
};

export const FileExplorerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const refreshData = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await mockApi.fetchFiles();
            dispatch({ type: 'SET_DATA', payload: data });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const navigateToFolder = (folderId) => {
        dispatch({ type: 'SET_CURRENT_FOLDER', payload: folderId });
        // Auto-expand the folder we navigate to
        dispatch({ type: 'TOGGLE_FOLDER_EXPAND', payload: folderId });
    };

    const createItem = async (parentId, item) => {
        try {
            await mockApi.createItem(parentId, item);
            await refreshData();
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const deleteItem = async (id) => {
        try {
            await mockApi.deleteItem(id);
            await refreshData();
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const moveItem = async (id, newParentId) => {
        try {
            await mockApi.updateItem(id, { parentId: newParentId });
            await refreshData();
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    const createFolder = async (parentId, name) => {
        const newFolder = {
            name,
            type: 'folder',
            children: [],
            modified: Date.now(),
        };
        await createItem(parentId, newFolder);
    };


    const renameItem = async (id, newName) => {
        try {
            await mockApi.updateItem(id, { name: newName });
            await refreshData();
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        }
    };

    // Helper to find file by ID recursively
    const getFileById = useCallback((id, items = state.files) => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = getFileById(id, item.children);
                if (found) return found;
            }
        }
        return null;
    }, [state.files]);

    const exportJSON = useCallback((folderId = null) => {
        if (!folderId) return JSON.parse(JSON.stringify(state.files));
        const folder = getFileById(folderId);
        return folder ? JSON.parse(JSON.stringify(folder)) : null;
    }, [state.files, getFileById]);

    const uploadFile = async (parentId, file) => {
        // Create an object URL for preview/download (valid for current session)
        const objectUrl = URL.createObjectURL(file);

        const newItem = {
            name: file.name,
            type: 'file',
            size: file.size, // Store raw number for logic
            formattedSize: formatFileSize(file.size), // Store formatted string for display
            modified: Date.now(),
            fileType: file.type.split('/')[0] || 'other', // rudimentary type detection
            url: objectUrl, // Store the blob URL
        };
        await createItem(parentId, newItem);
    };

    return (
        <FileExplorerContext.Provider
            value={{
                state,
                dispatch,
                navigateToFolder,
                createItem,
                createFolder,
                deleteItem,
                renameItem,
                moveItem,
                refreshData,
                getFileById,
                uploadFile,
                exportJSON
            }}
        >
            {children}
        </FileExplorerContext.Provider>
    );
};

export const useFileExplorer = () => useContext(FileExplorerContext);

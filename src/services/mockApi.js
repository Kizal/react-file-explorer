import { v4 as uuidv4 } from 'uuid';
import initialData from '../data/initialData.json';

const API_DELAY = 400; // ms
const ERROR_RATE = 0; // 0% for stability, can be increased for testing

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to simulate random errors
const maybeThrowError = () => {
  if (Math.random() < ERROR_RATE) {
    throw new Error('Network error simulated');
  }
};

// Deep clone to avoid mutation issues
const getSafeData = () => {
  const stored = localStorage.getItem('file-explorer-data');
  return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialData));
};

const saveData = (data) => {
  localStorage.setItem('file-explorer-data', JSON.stringify(data));
};

// Recursive find helper
const findItem = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Recursive delete helper returns new tree
const deleteItemRecursively = (items, id) => {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: item.children ? deleteItemRecursively(item.children, id) : undefined,
    }));
};

export const mockApi = {
  fetchFiles: async () => {
    await delay(API_DELAY);
    maybeThrowError();
    return getSafeData();
  },

  createItem: async (parentId, item) => {
    await delay(API_DELAY);
    const data = getSafeData();
    const newItem = { ...item, id: uuidv4(), modified: Date.now() };
    
    // Add to root if no parentId (or root id)
    if (!parentId) {
      data.push(newItem);
    } else {
      const parent = findItem(data, parentId);
      if (parent && parent.children) {
        parent.children.push(newItem);
      } else {
         throw new Error('Parent folder not found');
      }
    }
    
    saveData(data);
    return newItem;
  },

  updateItem: async (id, updates) => {
    await delay(API_DELAY);
    const data = getSafeData();
    let item = findItem(data, id);
    if (!item) throw new Error('Item not found');
    
    // Handle Move Operation
    if (updates.parentId) {
      // 1. Remove from old location
      const newData = deleteItemRecursively(data, id);
      
      // 2. Find new parent and add to its children
      // We need to find the item object again because deleteItemRecursively created new references
      // But actually we want to move the *same* item (with updates) to the new place.
      // Let's grab the item data before deletion.
      const itemToMove = { ...item, ...updates, modified: Date.now() };
      delete itemToMove.parentId; // Don't store parentId in the item itself if we rely on hierarchy
      
      if (updates.parentId === 'root') {
         newData.push(itemToMove);
      } else {
         const newParent = findItem(newData, updates.parentId);
         if (!newParent) throw new Error('New parent folder not found');
         if (!newParent.children) newParent.children = [];
         newParent.children.push(itemToMove);
      }
      saveData(newData);
      return itemToMove;
    }

    // Normal Update (Rename, etc)
    Object.assign(item, { ...updates, modified: Date.now() });
    saveData(data);
    return item;
  },

  deleteItem: async (id) => {
    await delay(API_DELAY);
    const data = getSafeData();
    const newData = deleteItemRecursively(data, id);
    saveData(newData);
    return { success: true };
  },
  
  // Special helper to reset data for demo
  resetData: async () => {
     localStorage.removeItem('file-explorer-data');
     return initialData;
  }
};

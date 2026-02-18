import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApi } from '../services/mockApi';

describe('mockApi', () => {
    beforeEach(async () => {
        await mockApi.resetData();
    });

    it('fetches files', async () => {
        const data = await mockApi.fetchFiles();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    it('creates an item in root', async () => {
        const newItem = { name: 'New Folder', type: 'folder', children: [] };
        await mockApi.createItem(null, newItem);

        const data = await mockApi.fetchFiles();
        const created = data.find(item => item.name === 'New Folder');
        expect(created).toBeDefined();
        expect(created.id).toBeDefined();
    });

    it('creates an item in a subfolder', async () => {
        const data = await mockApi.fetchFiles();
        const parentId = data[0].id;

        const newItem = { name: 'SubItem', type: 'file' };
        await mockApi.createItem(parentId, newItem);

        const updatedData = await mockApi.fetchFiles();
        const parent = updatedData.find(item => item.id === parentId);
        expect(parent.children.some(child => child.name === 'SubItem')).toBe(true);
    });

    it('deletes an item from root', async () => {
        const data = await mockApi.fetchFiles();
        const initialLength = data.length;

        // Create then delete
        await mockApi.createItem(null, { name: 'ToDelete', type: 'folder', children: [] });
        let afterCreate = await mockApi.fetchFiles();
        const created = afterCreate.find(i => i.name === 'ToDelete');
        expect(created).toBeDefined();

        await mockApi.deleteItem(created.id);
        const afterDelete = await mockApi.fetchFiles();
        expect(afterDelete.find(i => i.name === 'ToDelete')).toBeUndefined();
        expect(afterDelete.length).toBe(initialLength);
    });

    it('deletes a nested item', async () => {
        const data = await mockApi.fetchFiles();
        const parent = data[0];
        const childToDelete = parent.children[0];

        await mockApi.deleteItem(childToDelete.id);
        const updated = await mockApi.fetchFiles();
        const updatedParent = updated.find(i => i.id === parent.id);
        expect(updatedParent.children.find(c => c.id === childToDelete.id)).toBeUndefined();
    });

    it('updates an item name', async () => {
        const data = await mockApi.fetchFiles();
        const itemId = data[0].id;

        await mockApi.updateItem(itemId, { name: 'RenamedFolder' });
        const updated = await mockApi.fetchFiles();
        expect(updated.find(i => i.id === itemId).name).toBe('RenamedFolder');
    });

    it('returns a deep clone from fetchFiles', async () => {
        const data1 = await mockApi.fetchFiles();
        const data2 = await mockApi.fetchFiles();
        expect(data1).not.toBe(data2); // Different references
        expect(data1).toEqual(data2);  // Same content
    });

    it('creates item with an auto-generated id', async () => {
        await mockApi.createItem(null, { name: 'AutoId', type: 'file' });
        const data = await mockApi.fetchFiles();
        const item = data.find(i => i.name === 'AutoId');
        expect(item.id).toBeTruthy();
        expect(typeof item.id).toBe('string');
    });
});

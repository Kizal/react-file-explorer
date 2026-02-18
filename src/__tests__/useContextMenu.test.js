import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContextMenu } from '../hooks/useContextMenu';

describe('useContextMenu', () => {
    it('initially is not visible and has no selected item', () => {
        const { result } = renderHook(() => useContextMenu());
        expect(result.current.show).toBe(false);
        expect(result.current.selectedItem).toBe(null);
    });

    it('shows context menu on handleContextMenu call', () => {
        const { result } = renderHook(() => useContextMenu());
        const mockEvent = {
            preventDefault: vi.fn(),
            pageX: 100,
            pageY: 200,
        };

        act(() => {
            result.current.handleContextMenu(mockEvent, { id: '1', name: 'test.txt' });
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(result.current.show).toBe(true);
        expect(result.current.anchorPoint).toEqual({ x: 100, y: 200 });
        expect(result.current.selectedItem).toEqual({ id: '1', name: 'test.txt' });
    });

    it('closes context menu with setShow(false)', () => {
        const { result } = renderHook(() => useContextMenu());
        const mockEvent = {
            preventDefault: vi.fn(),
            clientX: 50,
            clientY: 50,
        };

        act(() => {
            result.current.handleContextMenu(mockEvent, { id: '2' });
        });
        expect(result.current.show).toBe(true);

        act(() => {
            result.current.setShow(false);
        });
        expect(result.current.show).toBe(false);
    });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 300));
        expect(result.current).toBe('hello');
    });

    it('updates the value after the specified delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'hello', delay: 300 } }
        );

        expect(result.current).toBe('hello');

        rerender({ value: 'world', delay: 300 });
        expect(result.current).toBe('hello'); // Not yet updated

        act(() => { vi.advanceTimersByTime(300); });
        expect(result.current).toBe('world');
    });

    it('resets the timer on rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'a', delay: 500 } }
        );

        rerender({ value: 'b', delay: 500 });
        act(() => { vi.advanceTimersByTime(200); });
        rerender({ value: 'c', delay: 500 });
        act(() => { vi.advanceTimersByTime(200); });

        expect(result.current).toBe('a'); // Still original

        act(() => { vi.advanceTimersByTime(300); });
        expect(result.current).toBe('c'); // Jumped to latest
    });

    afterEach(() => {
        vi.useRealTimers();
    });
});

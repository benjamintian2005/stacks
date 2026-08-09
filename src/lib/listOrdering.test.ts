import { describe, expect, it } from 'vitest';
import { computeSwap } from './listOrdering';

const items = [
  { id: 'a', position: 0 },
  { id: 'b', position: 1 },
  { id: 'c', position: 2 },
];

describe('computeSwap', () => {
  it('swaps an item with the one above it', () => {
    expect(computeSwap(items, 1, 'up')).toEqual([
      { id: 'b', position: 0 },
      { id: 'a', position: 1 },
    ]);
  });

  it('swaps an item with the one below it', () => {
    expect(computeSwap(items, 1, 'down')).toEqual([
      { id: 'b', position: 2 },
      { id: 'c', position: 1 },
    ]);
  });

  it('returns null when moving the first item up', () => {
    expect(computeSwap(items, 0, 'up')).toBeNull();
  });

  it('returns null when moving the last item down', () => {
    expect(computeSwap(items, 2, 'down')).toBeNull();
  });
});

export type PositionedItem = { id: string; position: number };

/** Returns the two {id, position} updates needed to swap an item with its up/down neighbor. */
export function computeSwap(
  items: PositionedItem[],
  index: number,
  direction: 'up' | 'down'
): [PositionedItem, PositionedItem] | null {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || index >= items.length || targetIndex < 0 || targetIndex >= items.length) {
    return null;
  }

  const current = items[index];
  const target = items[targetIndex];

  return [
    { id: current.id, position: target.position },
    { id: target.id, position: current.position },
  ];
}

import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaCard from './MediaCard';

describe('MediaCard', () => {
  it('renders title and year, and calls onClick', () => {
    const onClick = vi.fn();
    render(
      <MediaCard media={{ title: 'Fight Club', releaseYear: 1999, coverImageUrl: null }} onClick={onClick} />
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
    expect(screen.getByText('No cover')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

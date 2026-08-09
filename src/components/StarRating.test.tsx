import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from './StarRating';

describe('StarRating', () => {
  it('renders the numeric rating when a value is set', () => {
    render(<StarRating value={7} onChange={() => {}} />);
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('calls onChange with a half-star value when the left half of a star is clicked', () => {
    const onChange = vi.fn();
    render(<StarRating value={null} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Rate 2.5 of 5 stars'));

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('does not render clickable star buttons when disabled', () => {
    render(<StarRating value={4} onChange={() => {}} disabled />);
    expect(screen.queryByLabelText('Rate 1 of 5 stars')).not.toBeInTheDocument();
  });
});

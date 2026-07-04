import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterSidebar } from '@/components/FilterSidebar';
import { FILTER_DEFAULTS, FilterParams } from '@/hooks/use-filter-params';

const defaultFilters: FilterParams = { ...FILTER_DEFAULTS };

describe('FilterSidebar', () => {
  it('renders min and max price from props', () => {
    const filters: FilterParams = { ...FILTER_DEFAULTS, minPrice: 100, maxPrice: 600 };
    render(
      <FilterSidebar filters={filters} onFiltersChange={vi.fn()} />
    );

    const inputs = screen.getAllByRole('spinbutton');
    const minInput = inputs.find((el) => (el as HTMLInputElement).value === '100');
    const maxInput = inputs.find((el) => (el as HTMLInputElement).value === '600');
    expect(minInput).toBeDefined();
    expect(maxInput).toBeDefined();
  });

  it('renders the correct rating radio as checked based on props', () => {
    const filters: FilterParams = { ...FILTER_DEFAULTS, rating: 4.5 };
    render(
      <FilterSidebar filters={filters} onFiltersChange={vi.fn()} />
    );

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const checked = radios.find((r) => r.checked);
    expect(checked?.value).toBe('4.5');
  });

  it('renders the correct property type checkbox as checked based on props', () => {
    const filters: FilterParams = { ...FILTER_DEFAULTS, propertyType: 'room' };
    render(
      <FilterSidebar filters={filters} onFiltersChange={vi.fn()} />
    );

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    const checked = checkboxes.find((c) => c.checked);
    // The "Room" checkbox should be checked; others unchecked
    expect(checked).toBeDefined();
    const roomLabel = checked?.closest('label');
    expect(roomLabel?.textContent).toContain('Room');
  });

  it('calls onFiltersChange with updated rating when a radio is selected', () => {
    const onFiltersChange = vi.fn();
    render(
      <FilterSidebar filters={defaultFilters} onFiltersChange={onFiltersChange} />
    );

    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    // Click the 4.0 radio
    const radio40 = radios.find((r) => r.value === '4');
    fireEvent.click(radio40!);

    expect(onFiltersChange).toHaveBeenCalledWith({ rating: 4.0 });
  });

  it('calls onFiltersChange with the property type when a checkbox is toggled on', () => {
    const onFiltersChange = vi.fn();
    render(
      <FilterSidebar filters={defaultFilters} onFiltersChange={onFiltersChange} />
    );

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    // "Entire Place" is first
    fireEvent.click(checkboxes[0]);

    expect(onFiltersChange).toHaveBeenCalledWith({ propertyType: 'entire' });
  });

  it('calls onFiltersChange with empty propertyType when the active type checkbox is toggled off', () => {
    const onFiltersChange = vi.fn();
    const filters: FilterParams = { ...FILTER_DEFAULTS, propertyType: 'entire' };
    render(
      <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} />
    );

    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    // Clicking the already-checked "Entire Place" should deselect it
    fireEvent.click(checkboxes[0]);

    expect(onFiltersChange).toHaveBeenCalledWith({ propertyType: '' });
  });

  it('calls onFiltersChange with all defaults when Clear All is clicked', () => {
    const onFiltersChange = vi.fn();
    const filters: FilterParams = { ...FILTER_DEFAULTS, minPrice: 50, maxPrice: 400, rating: 4.5 };
    render(
      <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

    expect(onFiltersChange).toHaveBeenCalledWith({
      minPrice: FILTER_DEFAULTS.minPrice,
      maxPrice: FILTER_DEFAULTS.maxPrice,
      rating: FILTER_DEFAULTS.rating,
      propertyType: FILTER_DEFAULTS.propertyType,
    });
  });
});

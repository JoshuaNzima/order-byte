import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import type { MenuItem } from '@/shared/types/menu';

describe('useCart', () => {
  const item: MenuItem = {
    id: 'item-1',
    name: 'Test Item',
    description: 'Test',
    price: 100,
    available: true
  };

  it('adds items and updates totals', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(item);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.getTotalItems()).toBe(1);
    expect(result.current.getTotalPrice()).toBe(100);
  });

  it('increments quantity when adding the same item again', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(item);
      result.current.addToCart(item);
    });

    expect(result.current.cartItems[0]?.quantity).toBe(2);
    expect(result.current.getTotalItems()).toBe(2);
    expect(result.current.getTotalPrice()).toBe(200);
  });

  it('removes item when quantity is updated to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(item);
    });

    act(() => {
      result.current.updateQuantity(item.id, 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });
});

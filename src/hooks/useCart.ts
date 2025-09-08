'use client';

import { useState, useCallback } from 'react';
import { MenuItem } from '@/types/menu';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item: MenuItem, quantity = 1, notes?: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(cartItem => cartItem.item.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantity,
          notes: notes || updated[existingItemIndex].notes
        };
        return updated;
      } else {
        // Add new item
        return [...prev, { item, quantity, notes }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    setIsOpen
  };
}
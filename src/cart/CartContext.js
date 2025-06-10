import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            product: action.payload,
            quantity: (state.items[action.payload.id]?.quantity || 0) + 1
          }
        }
      };
    case 'REMOVE_ITEM':
      const newItems = { ...state.items };
      if (newItems[action.payload.id]?.quantity > 1) {
        newItems[action.payload.id].quantity -= 1;
      } else {
        delete newItems[action.payload.id];
      }
      return { ...state, items: newItems };
    case 'CLEAR_CART':
      return { items: {} };
    case 'SET_QUANTITY':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            product: action.payload.product,
            quantity: action.payload.quantity
          }
        }
      };
    case 'LOAD_CART':
      return {
        ...action.payload
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: {} });

  // Load cart from storage on startup
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    };
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to storage:', error);
      }
    };
    saveCart();
  }, [cart]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeFromCart = (product) => {
    dispatch({ type: 'REMOVE_ITEM', payload: product });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setQuantity = (product, quantity) => {
    dispatch({ 
      type: 'SET_QUANTITY', 
      payload: { id: product.id, product, quantity } 
    });
  };

  const cartCount = Object.values(cart.items).reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = () => {
    return Object.values(cart.items).reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  };

  const cartItems = Object.values(cart.items);

  return (
    <CartContext.Provider 
      value={{ 
        cart,
        cartItems,
        addToCart, 
        removeFromCart, 
        clearCart,
        setQuantity,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
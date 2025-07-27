import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart item structure
const cartItemStructure = {
  id: '',
  name: '',
  price: 0,
  unit: '',
  quantity: 0,
  imageUrl: '',
  isEcoFriendly: false
};

// Cart reducer actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0) // Remove items with 0 quantity
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

// Cart context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize state with data from localStorage
  const getInitialState = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return { items: parsedCart || [] };
      }
    } catch (error) {
      console.error('Error loading initial cart from localStorage:', error);
    }
    return { items: [] };
  };

  const [cartState, dispatch] = useReducer(cartReducer, getInitialState());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cartState.items && cartState.items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartState.items));
      } else {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartState.items]);

  // Cart actions
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };



  // Cart calculations
  const getTotalItems = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getEcoFriendlyItems = () => {
    return cartState.items.filter(item => item.isEcoFriendly);
  };

  const getTotalEcoFriendlyQuantity = () => {
    return getEcoFriendlyItems().reduce((total, item) => {
      // For eco-friendly bags (pack of 50), multiply quantity by 50
      const bagsPerPack = 50; // Each pack contains 50 bags
      return total + (item.quantity * bagsPerPack);
    }, 0);
  };

  const value = {
    items: cartState.items,
    totalItems: getTotalItems(),
    subtotal: getSubtotal(),
    ecoFriendlyItems: getEcoFriendlyItems(),
    totalEcoFriendlyQuantity: getTotalEcoFriendlyQuantity(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
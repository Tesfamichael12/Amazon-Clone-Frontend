// Cart reducer for useReducer
export const initialCartState = {
  cart: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cart.find((item) => item.id === action.payload.id);
      if (exists) {
        // If item exists, increase quantity
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Add new item with quantity 1
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }
    case "CLEAR_CART": {
      return { ...state, cart: [] };
    }
    case "DECREASE_CART_ITEM": {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }
    case "INCREASE_CART_ITEM": {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    default:
      return state;
  }
}

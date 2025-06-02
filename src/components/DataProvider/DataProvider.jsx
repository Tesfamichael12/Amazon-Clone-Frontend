import React, { createContext, useReducer, useContext, useEffect } from "react";
import { cartReducer, initialCartState } from "../../Utility/reducer.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage if available, fallback to initialCartState.cart
  let localCart = initialCartState.cart;
  let localShipping = initialCartState.shippingDetails;
  try {
    const stored = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(stored)) {
      localCart = stored;
    }
    const storedShipping = JSON.parse(localStorage.getItem("shippingDetails"));
    if (storedShipping) {
      localShipping = storedShipping;
    }
  } catch (e) {
    localCart = initialCartState.cart;
    localShipping = initialCartState.shippingDetails;
  }
  const [state, dispatch] = useReducer(cartReducer, {
    cart: localCart,
    user: initialCartState.user,
    shippingDetails: localShipping,
  });

  // Persist cart and shippingDetails to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);
  useEffect(() => {
    localStorage.setItem(
      "shippingDetails",
      JSON.stringify(state.shippingDetails)
    );
  }, [state.shippingDetails]);

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        dispatch,
        user: state.user,
        shippingDetails: state.shippingDetails,
      }}
    >
      {children}
      {/* ToastContainer removed: use the one in App.jsx */}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

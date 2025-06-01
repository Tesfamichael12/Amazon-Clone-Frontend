import React, { createContext, useReducer, useContext, useEffect } from "react";
import { cartReducer, initialCartState } from "../../Utility/reducer.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage if available, fallback to initialCartState.cart
  let localCart = initialCartState.cart;
  try {
    const stored = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(stored)) {
      localCart = stored;
    }
  } catch (e) {
    localCart = initialCartState.cart;
  }
  const [state, dispatch] = useReducer(cartReducer, {
    cart: localCart,
    user: initialCartState.user,
  });

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{ cart: state.cart, dispatch, user: state.user }}
    >
      {children}
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

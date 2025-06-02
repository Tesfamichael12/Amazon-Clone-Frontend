import React, { useState } from "react";
import Layout from "../../components/Layout";
import styles from "./payment.module.css";
import { useCart } from "../../components/DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { cart, shippingDetails } = useCart();
  const [method, setMethod] = useState("COD");
  const navigate = useNavigate();

  // Calculate total
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 0;
  const tax = subTotal > 0 ? Math.round(subTotal * 0.05 * 100) / 100 : 0;
  const total = subTotal + delivery + tax;

  // If no shipping info, redirect to shipping page
  React.useEffect(() => {
    if (!shippingDetails) {
      navigate("/shipping");
    }
  }, [shippingDetails, navigate]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Here you would handle order placement logic
    alert(
      `Order placed with ${
        method === "COD" ? "Cash on Delivery" : "Credit/Debit card"
      }!`
    );
    // Optionally, clear cart and redirect
    navigate("/orders");
  };

  return (
    <Layout>
      <div className={styles.paymentSectionWrapper}>
        <div className={styles.paymentBox}>
          <h2 className={styles.paymentTitle}>Choose your payment method</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className={styles.paymentOptions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={method === "COD"}
                  onChange={() => setMethod("COD")}
                />
                Cash on delivery (COD)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={method === "CARD"}
                  onChange={() => setMethod("CARD")}
                />
                Credit/Debit card
              </label>
            </div>
            <div className={styles.totalAmount}>
              Total Amount :{" "}
              <span className={styles.amount}>${total.toFixed(2)}</span>
            </div>
            <button className={styles.placeOrderBtn} type="submit">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;

import React from "react";
import Layout from "../../components/Layout";
import styles from "./orders.module.css";
import orderNowGif from "../../assets/Images/order-now.gif";

const Orders = () => {
  return (
    <Layout>
      <div className={styles.ordersWrapper}>
        <h2>Your Orders</h2>
        <div className={styles.orderNowGifWrap}>
          <img
            src={orderNowGif}
            alt="Order Now"
            className={styles.orderNowGif}
          />
        </div>
        {/* Orders list here */}
      </div>
    </Layout>
  );
};

export default Orders;

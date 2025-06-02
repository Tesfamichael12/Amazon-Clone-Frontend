import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import "./payment.css";
import { useCart } from "../../components/DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VanillaTilt from "vanilla-tilt";

import chipImg from "../../assets/Images/chip.png";
import visaImg from "../../assets/Images/visa2.png";
import mastercardImg from "../../assets/Images/master.png";
import amexImg from "../../assets/Images/american.png";

const Payment = () => {
  const { cart, shippingDetails, totalAmount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();
  const tiltRef = useRef(null);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState("");

  const [cardNameError, setCardNameError] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardExpiryError, setCardExpiryError] = useState("");
  const [cardCvvError, setCardCvvError] = useState("");

  useEffect(() => {
    if (!shippingDetails) {
      toast.error("Please complete shipping details first.");
      navigate("/shipping");
    }
  }, [shippingDetails, navigate]);

  useEffect(() => {
    if (paymentMethod === "CARD" && tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
      });
    }
  }, [paymentMethod]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setCardNumber(value);

    if (value.startsWith("4")) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(value)) {
      setCardType("mastercard");
    } else if (/^3[47]/.test(value)) {
      setCardType("amex");
    } else {
      setCardType("");
    }
    setCardNumberError("");
  };

  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setCardExpiry(value);
    setCardExpiryError("");
  };

  const validateCardDetails = () => {
    let isValid = true;
    if (!cardName.trim()) {
      setCardNameError("Name on card is required.");
      isValid = false;
    } else {
      setCardNameError("");
    }
    if (!cardNumber.trim()) {
      setCardNumberError("Card number is required.");
      isValid = false;
    } else if (cardType === "amex" && cardNumber.length !== 15) {
      setCardNumberError("AMEX card number must be 15 digits.");
      isValid = false;
    } else if (
      (cardType === "visa" || cardType === "mastercard") &&
      cardNumber.length !== 16
    ) {
      setCardNumberError("Visa/Mastercard number must be 16 digits.");
      isValid = false;
    } else if (
      cardType === "" &&
      cardNumber.length > 0 &&
      (cardNumber.length < 15 || cardNumber.length > 16)
    ) {
      setCardNumberError("Invalid card number length.");
      isValid = false;
    } else {
      setCardNumberError("");
    }
    if (!cardExpiry.trim()) {
      setCardExpiryError("Expiry date is required.");
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry)) {
      setCardExpiryError("Invalid expiry date format (MM/YY).");
      isValid = false;
    } else {
      const [month, year] = cardExpiry.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        setCardExpiryError("Card has expired.");
        isValid = false;
      } else {
        setCardExpiryError("");
      }
    }
    if (!cardCvv.trim()) {
      setCardCvvError("CVV is required.");
      isValid = false;
    } else if (cardType === "amex" && cardCvv.length !== 4) {
      setCardCvvError("AMEX CVV must be 4 digits.");
      isValid = false;
    } else if (
      (cardType === "visa" || cardType === "mastercard" || cardType === "") &&
      cardCvv.length !== 3
    ) {
      setCardCvvError("CVV must be 3 digits.");
      isValid = false;
    } else {
      setCardCvvError("");
    }
    return isValid;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (paymentMethod === "CARD") {
      if (!validateCardDetails()) {
        toast.error("Please correct the errors in card details.");
        return;
      }
      console.log("Card Details:", {
        cardName,
        cardNumber,
        cardExpiry,
        cardCvv,
        cardType,
      });
      toast.success("Order placed with Credit/Debit Card!");
    } else {
      toast.success("Order placed with Cash on Delivery!");
    }
    navigate("/orders");
  };

  const getCardImage = () => {
    switch (cardType) {
      case "visa":
        return visaImg;
      case "mastercard":
        return mastercardImg;
      case "amex":
        return amexImg;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="paymentSectionWrapper">
        <div className="paymentBox">
          <h2 className="paymentTitle">Choose your payment method</h2>
          <form onSubmit={handlePlaceOrder} className="paymentForm">
            <div className="paymentOptions">
              <label className="radioLabel">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on delivery (COD)
              </label>
              <label className="radioLabel">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === "CARD"}
                  onChange={() => setPaymentMethod("CARD")}
                />
                Credit/Debit card
              </label>
            </div>

            {paymentMethod === "CARD" && (
              <div className="cardDetailsSection">
                <h3 className="cardDetailsHeading">Card Details</h3>
                <div className="cardDisplay" ref={tiltRef}>
                  <img src={chipImg} alt="Chip" className="cardChip" />

                  <div className="cardNumberDisplay">
                    {cardNumber
                      .padEnd(16, "•")
                      .match(/.{1,4}/g)
                      ?.join(" ") || "•••• •••• •••• ••••"}
                  </div>
                  <div className="cardInfoDisplay">
                    <div className="cardHolderNameDisplay">
                      {cardName.toUpperCase() || "CARD HOLDER"}
                    </div>
                    <div className="cardExpiryDisplay">
                      {cardExpiry || "MM/YY"}
                    </div>
                  </div>
                </div>

                <div className="cardForm">
                  <div className="formRow">
                    <div className="formGroup">
                      <label htmlFor="cardNumber">Account Number*</label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234-4567-8901-2345"
                        maxLength={19}
                        className={cardNumberError ? "inputError" : ""}
                      />
                      {cardNumberError && (
                        <small className="errorMessage">
                          {cardNumberError}
                        </small>
                      )}
                    </div>
                    <div className="formGroup">
                      <label htmlFor="cardCvv">CVV Number*</label>
                      <input
                        type="text"
                        id="cardCvv"
                        value={cardCvv}
                        onChange={(e) => {
                          setCardCvv(e.target.value.replace(/[^0-9]/g, ""));
                          setCardCvvError("");
                        }}
                        placeholder="123"
                        maxLength={cardType === "amex" ? 4 : 3}
                        className={cardCvvError ? "inputError" : ""}
                      />
                      {cardCvvError && (
                        <small className="errorMessage">{cardCvvError}</small>
                      )}
                    </div>
                  </div>
                  <div className="formRow">
                    <div className="formGroup">
                      <label htmlFor="cardName">Card Holder's Name*</label>
                      <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value);
                          setCardNameError("");
                        }}
                        placeholder="Ex: John Doe"
                        className={cardNameError ? "inputError" : ""}
                      />
                      {cardNameError && (
                        <small className="errorMessage">{cardNameError}</small>
                      )}
                    </div>
                    <div className="formGroup">
                      <label htmlFor="cardExpiry">Expiry Date*</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="Ex: 0120 (01/20)"
                        maxLength="5"
                        className={cardExpiryError ? "inputError" : ""}
                      />
                      {cardExpiryError && (
                        <small className="errorMessage">
                          {cardExpiryError}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="totalAmount">
              Total Amount :{" "}
              <span className="amount">
                ${totalAmount ? totalAmount.toFixed(2) : "0.00"}
              </span>
            </div>
            <button className="placeOrderBtn" type="submit">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;

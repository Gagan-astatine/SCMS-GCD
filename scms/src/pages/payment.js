import React from "react";
import axios from "axios";

const Payment = () => {

  const handlePayment = async () => {
    try {
      // call backend
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: 500 }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SCMS",
        description: "Test Payment",
        order_id: order.id,

        handler: function (response) {
          console.log(response);
          alert("Payment Successful!");
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div>
      <h2>Payment Page</h2>
      <button onClick={handlePayment}>Pay ₹500</button>
    </div>
  );
};

export default Payment;
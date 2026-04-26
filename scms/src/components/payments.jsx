import React from "react";
import axios from "axios";

const Payments = () => {
  const handlePayment = async () => {
    try {
      // 1. Create order from backend
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: 500 } // ₹500 example
      );

      // 2. Open Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // from Razorpay dashboard
        amount: order.amount,
        currency: order.currency,
        name: "Your App Name",
        description: "Test Transaction",
        order_id: order.id,

        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
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
    }
  };

  return (
    <div>
      <h2>Razorpay Payment</h2>
      <button onClick={handlePayment}>Pay ₹500</button>
    </div>
  );
};

export default Payments;
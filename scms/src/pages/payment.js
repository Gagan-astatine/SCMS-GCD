import React, { useEffect, useState } from "react";
import axios from "axios";
import supabase from "../config/SupabaseClient";

const Payment = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handlePayment = async () => {
    try {
      if (!user) {
        alert("User not loaded yet");
        return;
      }

      // ✅ CREATE ORDER
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: 500,
          user_id: user.id,
        }
      );

      // ✅ RAZORPAY OPTIONS
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,

        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: user.id,
              amount: data.amount
            });

            alert("Payment successful");
          } catch (err) {
            console.error("Verify error:", err.response?.data || err.message);
            alert("Payment verification failed");
          }
        },
      };

      // ✅ OPEN RAZORPAY
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert("Payment failed");
    }
  };

  // ✅ THIS is where JSX should be
  return (
    <div>
      <h2>Payment Page</h2>
      <button onClick={handlePayment}>Pay ₹500</button>
    </div>
  );
};

export default Payment;
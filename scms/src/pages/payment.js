import React, { useEffect, useState } from "react";
import axios from "axios";
import supabase from "../config/SupabaseClient";
import { useTranslation } from "react-i18next";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Payment = () => {
  const { t } = useTranslation();
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
        `${API}/api/payment/create-order`,
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
            await axios.post(`${API}/api/payment/verify`, {
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

  return (
    <div className="payment-container">
      {/* 4K Background Image */}
      <div 
        className="payment-bg" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=3840&auto=format&fit=crop')` }}
      ></div>
      
      {/* Glassmorphic Card */}
      <div className="payment-card">
        <div className="payment-header">
          <h2>{t('payment.secure_checkout', 'Secure Checkout')}</h2>
          <p>{t('payment.complete_transaction', 'Complete your transaction securely')}</p>
        </div>

        <div className="payment-details">
          <div className="detail-row">
            <span>{t('payment.invoice_id', 'Invoice ID')}</span>
            <strong>#INV-9824-A</strong>
          </div>
          <div className="detail-row">
            <span>{t('payment.service', 'Service')}</span>
            <strong>{t('payment.service_name', 'Premium Freight Logistics')}</strong>
          </div>
          <div className="detail-row">
            <span>{t('payment.subtotal', 'Subtotal')}</span>
            <strong>₹420.00</strong>
          </div>
          <div className="detail-row">
            <span>{t('payment.taxes', 'Taxes & Fees')}</span>
            <strong>₹80.00</strong>
          </div>
          <div className="divider"></div>
          <div className="detail-row total-row">
            <span>{t('payment.total_amount', 'Total Amount')}</span>
            <strong className="total-amount">₹500.00</strong>
          </div>
        </div>

        <button className="btn-pay-now" onClick={handlePayment}>
          <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          {t('payment.pay_via_razorpay', 'Pay Securely via Razorpay')}
        </button>

        <div className="payment-footer">
          <p>{t('payment.encryption_notice', 'Secured with AES-256 bit encryption')}</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
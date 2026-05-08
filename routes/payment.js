 import React, { useState } from "react";

function Premium() {
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://taskmatrix-backend-wo86.onrender.com";

  const [loading, setLoading] = useState(false);

  // Load Razorpay SDK safely
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      // CREATE ORDER
      const res = await fetch(
        `${BASE_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: 50000,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Order creation failed");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "TaskMatrix",
        description: "Premium Upgrade",
        order_id: data.order.id,

        handler: function (response) {
          alert("Payment Successful ✅");
          console.log("Payment:", response);
        },

        prefill: {
          name: "User",
        },

        theme: {
          color: "#FFD700",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment Failed ❌");
      });

      rzp.open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Upgrade To Premium 🚀</h1>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "15px 25px",
          background: "gold",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          borderRadius: "10px",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Pay ₹500"}
      </button>
    </div>
  );
}

export default Premium;
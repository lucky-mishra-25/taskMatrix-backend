import React from "react";

function Premium() {
  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://taskmatrix-backend-wo86.onrender.com";

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

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

      console.log("PAYMENT RESPONSE:", data);

      if (!data.success) {
        alert(data.message || "Order creation failed");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
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

          console.log(response);
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);

      alert("Payment failed");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>Upgrade To Premium 🚀</h1>

      <button
        onClick={handlePayment}
        style={{
          padding: "15px 25px",
          background: "gold",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          borderRadius: "10px",
        }}
      >
        Pay ₹500
      </button>
    </div>
  );
}

export default Premium;
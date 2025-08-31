document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bookingForm");
  const payBtn = document.getElementById("payBtn");
  const totalAmountPreview = document.getElementById("totalAmountPreview");

  if (payBtn) {
    payBtn.addEventListener("click", async function () {
      // Collect values from form
      const startDate = form.querySelector("#startDate").value;
      const endDate = form.querySelector("#endDate").value;
      const customerName = form.querySelector("#customerName").value.trim();
      const customerEmail = form.querySelector("#customerEmail").value.trim();
      const customerPhone = form.querySelector("#customerPhone").value.trim();
      const customerAddress = form.querySelector("#customerAddress").value.trim();

      // Validate fields
      if (!startDate || !endDate) {
        alert("⚠️ Please select start and end dates");
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        alert("⚠️ End date must be after start date");
        return;
      }
      if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        alert("⚠️ Please fill in all user details");
        return;
      }
      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(customerEmail)) {
        alert("⚠️ Please enter a valid email address.");
        return;
      }

      // Validate phone number (10 digits, India format)
      const phonePattern = /^[6-9]\d{9}$/;
      if (!phonePattern.test(customerPhone)) {
        alert("⚠️ Please enter a valid phone number. ");
        return;
      }


      // Calculate days
      const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Get venue data
      const pricePerDay = parseInt(payBtn.getAttribute("data-price"));
      const venueId = payBtn.getAttribute("data-venueid");
      const venueName = payBtn.getAttribute("data-venuename");
      const razorpayKey = payBtn.getAttribute("data-razorpaykey");

      const totalAmount = days * pricePerDay;
      // totalAmountPreview.textContent = `📅 ${days} day(s) × ₹${pricePerDay} = ₹${totalAmount}`;

      // Confirm before proceeding
      if (!confirm(`Booking for ${days} day(s). Total Amount: ₹${totalAmount}. Proceed to Pay?`)) {
        return;
      }

      // Step 1: Create order on backend
      const response = await fetch("/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount })
      });

      const order = await response.json();
      if (!order.id) {
        alert("❌ Failed to create order. Please try again.");
        return;
      }

      // Step 2: Configure Razorpay Checkout
      var options = {
        "key": razorpayKey,
        "amount": order.amount,
        "currency": order.currency,
        "name": venueName,
        "description": "Venue Booking Payment",
        "order_id": order.id,
        "prefill": {
          "name": customerName,
          "email": customerEmail,
          "contact": customerPhone
        },
        "notes": {
          "address": customerAddress
        },
        "handler": async function (response) {
          // Step 3: Verify payment on backend
          const verifyRes = await fetch("/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              venueId,
              startDate,
              endDate,
              amount: totalAmount,
              days,
              customerName,
              customerEmail,
              customerPhone,
              customerAddress
            })
          });

          const result = await verifyRes.json();
          if (result.success) {
            alert("✅ Payment Verified & Booking Confirmed!");
            window.location.href = "/my-bookings"; // redirect to bookings page
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },
        "modal": {
          "ondismiss": function() {
            alert("⚠️ Payment was cancelled.");
          }
        },

        "theme": { "color": "#3399cc" }
      };

      // Step 4: Open Razorpay popup
      var rzp1 = new Razorpay(options);
      rzp1.open();
    });
  }
});

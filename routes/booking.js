const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncErr = require('../utils/wrapAsync.js');
const { isLoggedIn } = require('../middleware.js');
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Listing = require('../models/listing.js');
const Booking = require('../models/booking.js');
const User = require('../models/user.js');

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_KEY_ID,
  key_secret: process.env.PAYMENT_KEY_SECRET
});

// ------------------ Routes ------------------

// Booking Page (payment)
router.get("/venue/:id/booking", isLoggedIn, async (req, res) => {
  const venueId = req.params.id;
  try {
    const venue = await Listing.findById(venueId);
    if (!venue) {
      return res.status(404).send("Venue not found");
    }
    res.render("policies/payment", {
      name: venue.title,
      price: venue.price,
      venueId: venue._id,
      razorpayKey: process.env.PAYMENT_KEY_ID
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Enquiry
router.get("/venue/:id/enquiry", isLoggedIn, (req, res) => {
  let { id } = req.params;
  res.render("policies/enquiry.ejs", { id });
});

router.post("/enquiry/:id", isLoggedIn, (req, res) => {
  let { id } = req.params;
  req.flash('success', `Enquiry sent successfully, Venue Owner will contact you soon!`);
  res.redirect(`/venue/${id}`);
});

// Route to create Razorpay order
router.post("/create-order", async (req, res) => {
  const { amount,venueName } = req.body;

  const options = {
    amount: amount * 100, // amount in paise
    currency: "INR",
    receipt: `BMV_${venueName}_${Date.now()}`,
    notes: {
      website: "Book My Venue",
      venue: venueName,
      support_email: "support@bookmyvenue.com"
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order); // send order back to frontend
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).send("Error creating Razorpay order");
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      venueId,
      startDate,
      endDate,
      amount,
      days,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress
    } = req.body;
    const today = new Date();
    today.setHours(0,0,0,0);

    if (new Date(startDate) < today || new Date(endDate) < today) {
    return res.json({ success: false, message: "Booking dates cannot be in the past" });
    }

    if (new Date(endDate) < new Date(startDate)) {
    return res.json({ success: false, message: "End date must be after start date" });
    }

    // Step 1: Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.PAYMENT_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Step 2: Compare signatures
    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch:", expectedSignature, razorpay_signature);
      return res.json({ success: false, message: "Payment Verification Failed" });
    }

    // Step 3: Save booking
    const booking = new Booking({
      venue: venueId,
      user: req.user._id,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      startDate,
      endDate,
      days,
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Paid"
    });

    const savedBooking = await booking.save();

    // Step 4: Link booking to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookings: savedBooking._id }
    });

    res.json({ success: true, message: "Booking confirmed", booking: savedBooking });
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/my-bookings", async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "bookings",
        populate: { path: "venue" } // also populate venue details
      });

    res.render("listingsRoute/my-bookings", { bookings: user.bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings");
  }
});

module.exports = router;

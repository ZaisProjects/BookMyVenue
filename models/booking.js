const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  venue: { type: Schema.Types.ObjectId, ref: "Listing", required: true },

  // Booking snapshot details
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true },
  amount: { type: Number, required: true },

  paymentId: { type: String, required: true },
  orderId: { type: String },
  status: { type: String, enum: ["Paid", "Pending", "Cancelled"], default: "Paid" },

  // Who made this booking
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;


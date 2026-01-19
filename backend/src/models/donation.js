const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  donorName: { type: String, required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "campaigns", required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "processing", "completed", "failed", "refunded"], 
    default: "completed" 
  },
  paymentMethod: { 
    type: String, 
    enum: ["credit_card", "debit_card", "upi", "net_banking", "wallet"], 
    default: "upi" 
  },
  transactionId: { type: String, default: null },
  refundStatus: { 
    type: String, 
    enum: ["none", "requested", "processing", "completed", "rejected"], 
    default: "none" 
  },
  refundReason: { type: String, default: null },
  refundedAt: { type: Date, default: null },
  isSuspicious: { type: Boolean, default: false },
  suspiciousReason: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("donations", donationSchema);

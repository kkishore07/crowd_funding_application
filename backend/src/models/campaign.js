const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    endDate: { type: Date, required: true },
    isExpired: { type: Boolean, default: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    creatorName: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "closed"], default: "pending" },
    rejectionReason: { type: String, default: null },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0, min: 0 },
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      rating: { type: Number, required: true, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Method to check if campaign has expired
campaignSchema.methods.checkExpired = function() {
  if (new Date() > this.endDate && !this.isExpired) {
    this.isExpired = true;
    return true;
  }
  return this.isExpired;
};

module.exports = mongoose.model("campaigns", campaignSchema);

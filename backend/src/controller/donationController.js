const Donation = require("../models/donation");
const Campaign = require("../models/campaign");

// Fraud detection helper
const detectFraudulentActivity = async (donor, campaignId, amount) => {
  // Check for duplicate donations within 1 minute
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentDonation = await Donation.findOne({
    donor,
    campaign: campaignId,
    createdAt: { $gte: oneMinuteAgo }
  });
  
  if (recentDonation) {
    return { isSuspicious: true, reason: "Duplicate donation within 1 minute" };
  }

  // Check for unusually high amount (>1,000,000)
  if (amount > 1000000) {
    return { isSuspicious: true, reason: "Unusually high donation amount" };
  }

  // Check for rapid multiple donations (more than 5 in an hour)
  const oneHourAgo = new Date(Date.now() - 3600000);
  const hourlyDonations = await Donation.countDocuments({
    donor,
    createdAt: { $gte: oneHourAgo }
  });

  if (hourlyDonations >= 5) {
    return { isSuspicious: true, reason: "Too many donations in short time" };
  }

  return { isSuspicious: false, reason: null };
};

const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, paymentMethod } = req.body;
    if (!campaignId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Campaign and amount required" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.status !== "approved") return res.status(400).json({ message: "Campaign not active" });

    // Check campaign deadline
    campaign.checkExpired();
    if (campaign.isExpired) {
      await campaign.save();
      return res.status(400).json({ message: "Campaign has expired" });
    }

    // Fraud detection
    const fraudCheck = await detectFraudulentActivity(req.user.id, campaignId, amount);

    // Generate mock transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = await Donation.create({
      donor: req.user.id,
      donorName: req.user.email,
      campaign: campaignId,
      amount,
      paymentMethod: paymentMethod || "upi",
      paymentStatus: "completed",
      transactionId,
      isSuspicious: fraudCheck.isSuspicious,
      suspiciousReason: fraudCheck.reason,
    });

    // Only add to campaign if not flagged as suspicious
    if (!fraudCheck.isSuspicious) {
      campaign.currentAmount += amount;
      await campaign.save();
    }

    res.status(201).json({ 
      message: fraudCheck.isSuspicious 
        ? "Donation flagged for review due to suspicious activity" 
        : "Donation successful", 
      donation,
      warning: fraudCheck.isSuspicious ? fraudCheck.reason : null
    });
  } catch (err) {
    res.status(400).json({ message: "Donation failed", error: err.message });
  }
};

const getMyDonations = async (req, res) => {
  try {
    console.log("getMyDonations called with user:", req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const donations = await Donation.find({ donor: req.user.id })
      .populate({
        path: "campaign",
        select: "title description targetAmount currentAmount status"
      })
      .sort({ createdAt: -1 })
      .lean();
    
    // Filter out donations where campaign no longer exists
    const validDonations = donations.filter(donation => donation.campaign !== null);
    
    console.log(`Found ${validDonations.length} donations for user ${req.user.id}`);
    res.status(200).json({ donations: validDonations });
  } catch (err) {
    console.error("Error in getMyDonations:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Failed to fetch donations", error: err.message });
  }
};

// Request refund for a donation (mock implementation)
const requestRefund = async (req, res) => {
  try {
    const { donationId, reason } = req.body;
    
    if (!donationId || !reason) {
      return res.status(400).json({ message: "Donation ID and reason required" });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Check if donation belongs to user
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if already refunded
    if (donation.refundStatus !== "none") {
      return res.status(400).json({ message: "Refund already requested or processed" });
    }

    // Check if donation is older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (donation.createdAt < sevenDaysAgo) {
      return res.status(400).json({ message: "Refund window expired (7 days)" });
    }

    // Update donation
    donation.refundStatus = "requested";
    donation.refundReason = reason;
    await donation.save();

    res.status(200).json({ 
      message: "Refund request submitted successfully", 
      donation 
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to request refund", error: err.message });
  }
};

// Process refund (mock - admin only)
const processRefund = async (req, res) => {
  try {
    const { donationId, approve } = req.body;
    
    if (!donationId || approve === undefined) {
      return res.status(400).json({ message: "Donation ID and approval status required" });
    }

    const donation = await Donation.findById(donationId).populate('campaign');
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.refundStatus !== "requested") {
      return res.status(400).json({ message: "No refund request pending" });
    }

    if (approve) {
      donation.refundStatus = "completed";
      donation.paymentStatus = "refunded";
      donation.refundedAt = new Date();
      
      // Deduct amount from campaign if it was added
      if (donation.campaign && !donation.isSuspicious) {
        donation.campaign.currentAmount = Math.max(0, donation.campaign.currentAmount - donation.amount);
        await donation.campaign.save();
      }
    } else {
      donation.refundStatus = "rejected";
    }

    await donation.save();

    res.status(200).json({ 
      message: approve ? "Refund processed successfully" : "Refund request rejected", 
      donation 
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to process refund", error: err.message });
  }
};

// Get all pending refund requests (admin only)
const getPendingRefunds = async (req, res) => {
  try {
    const donations = await Donation.find({ refundStatus: "requested" })
      .populate('donor', 'name email')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch refund requests", error: err.message });
  }
};

// Get suspicious donations (admin only)
const getSuspiciousDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ isSuspicious: true })
      .populate('donor', 'name email')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ donations });
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch suspicious donations", error: err.message });
  }
};

module.exports = { 
  createDonation, 
  getMyDonations, 
  requestRefund, 
  processRefund, 
  getPendingRefunds,
  getSuspiciousDonations 
};

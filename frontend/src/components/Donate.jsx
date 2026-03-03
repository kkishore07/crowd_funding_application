import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import CampaignQRCode from "./CampaignQRCode";
import "../styles/donation.css";

const Donate = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/campaigns/${campaignId}`)
      .then(r => r.json())
      .then(d => { 
        setCampaign(d.campaign); 
        setLoading(false); 
        
        // Check if campaign has expired
        if (d.campaign.isExpired) {
          setError("This campaign has expired and is no longer accepting donations");
        } else if (d.campaign.currentAmount >= d.campaign.targetAmount) {
          setError("This campaign has reached its target and is no longer accepting donations");
        }
      })
      .catch(() => { setError("Campaign not found"); setLoading(false); });
  }, [campaignId]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Enter valid amount");
      return;
    }
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setWarning("");
    try {
      const res = await fetch(`${API_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          campaignId, 
          amount: parseFloat(amount),
          paymentMethod 
        }),
      });

      const data = await res.json();
      
      // Handle authentication errors
      if (res.status === 401) {
        sessionStorage.removeItem("token");
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      if (res.ok) {
        setSuccess("Donation successful!");
        
        // Show warning if donation was flagged
        if (data.warning) {
          setWarning(data.warning);
        }
        
        setAmount("");
        setTimeout(() => navigate("/campaigns"), 3000);
      } else {
        setError(data.message || "Donation failed");
      }
    } catch (err) {
      setError("Error processing donation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (!campaign) return <div className="dashboard-container"><p className="donation-error">Campaign not found</p></div>;

  const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  const isTargetReached = campaign.currentAmount >= campaign.targetAmount;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Support Campaign</h2>
        </div>

        <div className="donation-form-container">
          {campaign.image && (
            <img 
              src={`${API_URL}/uploads/${campaign.image}`} 
              alt={campaign.title}
              style={{ 
                width: "100%", 
                maxHeight: "300px", 
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "20px"
              }}
            />
          )}
          <div className="donation-info">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <div style={{ marginTop: "12px", display: "flex", gap: "16px", fontSize: "0.9rem", color: "#666" }}>
              <span>📅 {daysLeft} days left</span>
              <span>⭐ {campaign.averageRating.toFixed(1)}/5 ({campaign.totalRatings} ratings)</span>
            </div>
            {campaign.isExpired && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "#ff6b6b",
                color: "white",
                borderRadius: "4px",
                fontWeight: "500"
              }}>
                ⚠️ This campaign has expired
              </div>
            )}
            {isTargetReached && (
              <div style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "#10b981",
                color: "white",
                borderRadius: "4px",
                fontWeight: "500"
              }}>
                ✅ Target amount reached
              </div>
            )}
          </div>

          <div className="donation-progress">
            Progress: ₹{campaign.currentAmount} of ₹{campaign.targetAmount}
            <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "var(--primary)", width: `${progress}%` }} />
            </div>
          </div>

          {/* Share Campaign QR Code */}
          <div style={{ marginTop: "20px" }}>
            <CampaignQRCode campaignId={campaign._id} campaignTitle={campaign.title} />
          </div>

          {error && <div className="donation-error">{error}</div>}
          {success && <div className="donation-success">{success}</div>}
          {warning && (
            <div style={{
              padding: "12px",
              backgroundColor: "#fff3cd",
              color: "#856404",
              borderRadius: "4px",
              marginBottom: "16px",
              border: "1px solid #ffeaa7"
            }}>
              ⚠️ {warning}
            </div>
          )}

          <form onSubmit={handleDonate} className="donation-form">
            <div className="form-group">
              <label className="form-label">Donation Amount (₹) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => { 
                  setAmount(e.target.value); 
                  if (!campaign.isExpired && !isTargetReached) setError(""); 
                }}
                className="input"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
                disabled={campaign.isExpired || isTargetReached}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input"
                required
                disabled={campaign.isExpired || isTargetReached}
              >
                <option value="upi">UPI</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="net_banking">Net Banking</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading || campaign.isExpired || isTargetReached} 
              className="btn btn-primary btn-lg"
            >
              {loading ? "Processing..." : "Donate Now"}
            </button>
            <button type="button" onClick={() => navigate("/campaigns")} className="btn btn-secondary btn-lg">
              Cancel
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Donate;

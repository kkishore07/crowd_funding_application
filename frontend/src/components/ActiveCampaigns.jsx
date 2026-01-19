import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import RatingStars from "./RatingStars";
import "../styles/campaign.css";

const ActiveCampaigns = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const fetchMyCampaigns = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/campaigns/creator/my-campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setCampaigns(data.campaigns || []);
      } else {
        setError(data.message || "Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Error fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "dashboard-badge-warning",
      approved: "dashboard-badge-success",
      rejected: "dashboard-badge-danger",
    };
    return badges[status] || "";
  };

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100).toFixed(1);
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Campaigns</h2>
          <button onClick={() => navigate("/creator-dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>No campaigns yet. Create your first campaign!</p>
            <button onClick={() => navigate("/create-campaign")} className="btn btn-primary" style={{ marginTop: "16px" }}>
              Create Campaign
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="campaign-card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ marginBottom: "8px" }}>{campaign.title}</h3>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
                      <span className={`dashboard-badge ${getStatusBadge(campaign.status)}`}>
                        {campaign.status.toUpperCase()}
                      </span>
                      {campaign.status === "approved" && campaign.totalRatings > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <RatingStars rating={campaign.averageRating || 0} readOnly size="small" />
                          <span style={{ fontSize: "12px", color: "#666" }}>
                            ({campaign.totalRatings})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "14px", color: "#666" }}>Target</p>
                    <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹{campaign.targetAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <p style={{ marginBottom: "16px", color: "#666" }}>{campaign.description}</p>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>Progress: {getProgress(campaign.currentAmount, campaign.targetAmount)}%</span>
                    <span>₹{campaign.currentAmount.toLocaleString('en-IN')} raised</span>
                  </div>
                  <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        height: "100%", 
                        background: campaign.status === "approved" ? "var(--primary)" : "#ccc",
                        width: `${getProgress(campaign.currentAmount, campaign.targetAmount)}%`,
                        transition: "width 0.3s ease"
                      }} 
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "14px" }}>
                  <div>
                    <strong>Created:</strong> {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}
                    {campaign.isExpired && (
                      <span style={{ 
                        marginLeft: "8px", 
                        backgroundColor: "#ff6b6b", 
                        color: "white", 
                        padding: "2px 6px", 
                        borderRadius: "3px", 
                        fontSize: "0.75rem",
                        fontWeight: "bold"
                      }}>
                        EXPIRED
                      </span>
                    )}
                    {!campaign.isExpired && (
                      <span style={{ marginLeft: "8px", color: "#666", fontSize: "0.85rem" }}>
                        ({Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} days left)
                      </span>
                    )}
                  </div>
                </div>

                {campaign.status === "rejected" && campaign.rejectionReason && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "#fee", borderRadius: "4px", color: "#c00" }}>
                    <strong>Rejection Reason:</strong> {campaign.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActiveCampaigns;

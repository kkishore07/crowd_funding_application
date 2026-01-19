import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../styles/campaign.css";

const Analytics = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/campaigns/creator/analytics`, {
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
        setAnalytics(data);
      } else {
        setError(data.message || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("Error fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;
  if (error) return <div className="dashboard-container"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Analytics Dashboard</h2>
          <button onClick={() => navigate("/creator-dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-primary">📊</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.totalCampaigns}</h3>
              <p className="dashboard-card-description">Total Campaigns</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-success">✅</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.approvedCampaigns}</h3>
              <p className="dashboard-card-description">Approved</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-warning">⏳</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.pendingCampaigns}</h3>
              <p className="dashboard-card-description">Pending</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-danger">❌</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.rejectedCampaigns}</h3>
              <p className="dashboard-card-description">Rejected</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-success">💰</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">₹{analytics.totalRaised.toLocaleString('en-IN')}</h3>
              <p className="dashboard-card-description">Total Raised</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-primary">🎯</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">₹{analytics.totalTarget.toLocaleString('en-IN')}</h3>
              <p className="dashboard-card-description">Total Target</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-purple">💝</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.totalDonations}</h3>
              <p className="dashboard-card-description">Total Donations</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-icon dashboard-card-icon-orange">📈</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">{analytics.averageProgress}%</h3>
              <p className="dashboard-card-description">Avg Progress</p>
            </div>
          </div>
        </div>

        {analytics.topCampaigns && analytics.topCampaigns.length > 0 && (
          <div>
            <h3 style={{ marginBottom: "16px" }}>Top Performing Campaigns</h3>
            <div style={{ display: "grid", gap: "16px" }}>
              {analytics.topCampaigns.map((campaign) => (
                <div key={campaign._id} className="campaign-card" style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: "8px" }}>{campaign.title}</h4>
                      <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#666" }}>
                        <span>Target: ₹{campaign.targetAmount.toLocaleString('en-IN')}</span>
                        <span>Raised: ₹{campaign.currentAmount.toLocaleString('en-IN')}</span>
                        <span>Donations: {campaign.donationCount}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--primary)" }}>
                        {((campaign.currentAmount / campaign.targetAmount) * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Progress</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;

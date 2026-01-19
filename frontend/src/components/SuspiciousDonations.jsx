import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../styles/donation.css";

const SuspiciousDonations = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSuspiciousDonations();
  }, [token, navigate]);

  const fetchSuspiciousDonations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/donations/suspicious`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setDonations(data.donations || []);
      } else {
        setError(data.message || "Failed to fetch suspicious donations");
      }
    } catch (err) {
      setError("Error fetching suspicious donations");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "#28a745",
      pending: "#ffc107",
      processing: "#17a2b8",
      failed: "#dc3545",
      refunded: "#6c757d"
    };
    return (
      <span style={{
        backgroundColor: statusColors[status] || "#6c757d",
        color: "white",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.85rem",
        fontWeight: "500"
      }}>
        {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Suspicious Donations</h2>
          <button onClick={() => navigate("/admin-dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {error && <div className="donation-error">{error}</div>}

        {donations.length === 0 ? (
          <div className="empty-donations">
            <p>No suspicious donations found</p>
          </div>
        ) : (
          <div className="donations-list">
            {donations.map((donation) => (
              <div key={donation._id} className="donation-item" style={{ 
                border: "2px solid #ff6b6b",
                backgroundColor: "#fff5f5"
              }}>
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ff6b6b",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: "bold"
                }}>
                  ⚠️ FLAGGED
                </div>
                
                <div className="donation-details" style={{ flex: 1, paddingRight: "120px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong style={{ fontSize: "1.1rem" }}>
                      {donation.campaign?.title || "Campaign"}
                    </strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem" }}>
                    <span>
                      <strong>Donor:</strong> {donation.donor?.name || donation.donor?.email || "Unknown"}
                    </span>
                    <span>
                      <strong>Amount:</strong> ₹{donation.amount.toFixed(2)}
                    </span>
                    <span>
                      <strong>Donated on:</strong> {new Date(donation.createdAt).toLocaleString()}
                    </span>
                    <span>
                      <strong>Transaction ID:</strong> {donation.transactionId || "N/A"}
                    </span>
                    <span>
                      <strong>Payment Method:</strong> {donation.paymentMethod?.toUpperCase().replace('_', ' ') || "N/A"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong>Status:</strong> {getStatusBadge(donation.paymentStatus)}
                    </span>
                  </div>
                  <div style={{ 
                    marginTop: "12px", 
                    padding: "12px", 
                    backgroundColor: "#fff3cd", 
                    borderRadius: "4px",
                    border: "1px solid #ff6b6b"
                  }}>
                    <strong style={{ display: "block", marginBottom: "6px", color: "#721c24" }}>
                      ⚠️ Suspicious Activity Detected:
                    </strong>
                    <p style={{ margin: 0, color: "#856404", fontWeight: "500" }}>
                      {donation.suspiciousReason}
                    </p>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
                    <strong>Note:</strong> This donation was flagged by the fraud prevention system and 
                    was not added to the campaign's total amount until reviewed.
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SuspiciousDonations;

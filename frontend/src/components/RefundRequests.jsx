import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../styles/donation.css";

const RefundRequests = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchRefunds();
  }, [token, navigate]);

  const fetchRefunds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/donations/refund/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setRefunds(data.donations || []);
      } else {
        setError(data.message || "Failed to fetch refund requests");
      }
    } catch (err) {
      setError("Error fetching refund requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (donationId, approve) => {
    try {
      const response = await fetch(`${API_URL}/api/donations/refund/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ donationId, approve })
      });

      const data = await response.json();

      if (response.ok) {
        alert(approve ? "Refund approved successfully" : "Refund rejected");
        fetchRefunds(); // Refresh list
      } else {
        alert(data.message || "Failed to process refund");
      }
    } catch (err) {
      alert("Error processing refund");
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Refund Requests</h2>
          <button onClick={() => navigate("/admin-dashboard")} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>

        {error && <div className="donation-error">{error}</div>}

        {refunds.length === 0 ? (
          <div className="empty-donations">
            <p>No pending refund requests</p>
          </div>
        ) : (
          <div className="donations-list">
            {refunds.map((donation) => (
              <div key={donation._id} className="donation-item" style={{ 
                border: "2px solid #ffc107",
                backgroundColor: "#fffbf0"
              }}>
                <div className="donation-details" style={{ flex: 1 }}>
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
                  </div>
                  <div style={{ 
                    marginTop: "12px", 
                    padding: "12px", 
                    backgroundColor: "#fff3cd", 
                    borderRadius: "4px",
                    border: "1px solid #ffc107"
                  }}>
                    <strong style={{ display: "block", marginBottom: "6px" }}>Refund Reason:</strong>
                    <p style={{ margin: 0, color: "#856404" }}>{donation.refundReason}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "120px" }}>
                  <button
                    onClick={() => handleRefund(donation._id, true)}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRefund(donation._id, false)}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RefundRequests;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import "../styles/donation.css";

const MyDonations = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundModal, setRefundModal] = useState({ show: false, donationId: null });
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    fetchDonations();
  }, [token, navigate]);

  const fetchDonations = () => {
    fetch(`${API_URL}/api/donations/user/my-donations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (r) => {
        const data = await r.json();
        
        // Handle authentication errors
        if (r.status === 401) {
          sessionStorage.removeItem("token");
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
          setLoading(false);
          return;
        }
        
        if (!r.ok) {
          console.error("Server error:", data);
          throw new Error(data.message || `Server error: ${r.status}`);
        }
        
        setDonations(data.donations || []);
        setLoading(false);
      })
      .catch((err) => { 
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load donations"); 
        setLoading(false); 
      });
  };

  const handleRefundRequest = async () => {
    if (!refundReason.trim()) {
      alert("Please provide a reason for refund");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/donations/refund/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          donationId: refundModal.donationId,
          reason: refundReason
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Refund request submitted successfully");
        setRefundModal({ show: false, donationId: null });
        setRefundReason("");
        fetchDonations(); // Refresh donations
      } else {
        alert(data.message || "Failed to request refund");
      }
    } catch (err) {
      alert("Error requesting refund");
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

  const getRefundBadge = (status) => {
    const statusColors = {
      none: "#6c757d",
      requested: "#ffc107",
      processing: "#17a2b8",
      completed: "#28a745",
      rejected: "#dc3545"
    };
    return (
      <span style={{
        backgroundColor: statusColors[status] || "#6c757d",
        color: "white",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: "500"
      }}>
        {status?.toUpperCase()}
      </span>
    );
  };

  const canRequestRefund = (donation) => {
    // Can request refund if:
    // - Payment is completed
    // - Not already refunded or requested
    // - Donation is within 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return (
      donation.paymentStatus === "completed" &&
      donation.refundStatus === "none" &&
      new Date(donation.createdAt) > sevenDaysAgo
    );
  };

  if (!token) return <div className="dashboard-container"><p className="donation-error">Please login first</p></div>;
  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Donations</h2>
        </div>

        {error && <div className="donation-error">{error}</div>}

        {donations.length === 0 ? (
          <div className="empty-donations">
            <p>No donations yet. Start supporting campaigns!</p>
          </div>
        ) : (
          <div className="donations-list">
            {donations.map((d) => (
              <div key={d._id} className="donation-item" style={{ 
                border: d.isSuspicious ? "2px solid #ff6b6b" : "1px solid #ddd",
                position: "relative"
              }}>
                {d.isSuspicious && (
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#ff6b6b",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    ⚠ FLAGGED
                  </div>
                )}
                <div className="donation-details">
                  <strong>{d.campaign?.title || "Campaign"}</strong>
                  <small>Donated on {new Date(d.createdAt).toLocaleDateString()}</small>
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem" }}>Payment: {getStatusBadge(d.paymentStatus)}</span>
                    {d.paymentMethod && (
                      <span style={{ fontSize: "0.85rem", color: "#666" }}>
                        via {d.paymentMethod.toUpperCase().replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  {d.transactionId && (
                    <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "#888" }}>
                      TXN: {d.transactionId}
                    </div>
                  )}
                  {d.refundStatus !== "none" && (
                    <div style={{ marginTop: "8px" }}>
                      <span style={{ fontSize: "0.85rem", marginRight: "8px" }}>Refund: {getRefundBadge(d.refundStatus)}</span>
                      {d.refundedAt && (
                        <span style={{ fontSize: "0.75rem", color: "#666" }}>
                          on {new Date(d.refundedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                  {d.isSuspicious && d.suspiciousReason && (
                    <div style={{ 
                      marginTop: "8px", 
                      padding: "8px", 
                      backgroundColor: "#fff3cd", 
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                      color: "#856404"
                    }}>
                      ⚠ {d.suspiciousReason}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div className="donation-amount">₹{d.amount.toFixed(2)}</div>
                  {canRequestRefund(d) && (
                    <button
                      onClick={() => setRefundModal({ show: true, donationId: d._id })}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ff6b6b",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      Request Refund
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refund Modal */}
        {refundModal.show && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%"
            }}>
              <h3 style={{ marginBottom: "16px" }}>Request Refund</h3>
              <p style={{ marginBottom: "16px", fontSize: "0.9rem", color: "#666" }}>
                Please provide a reason for the refund request:
              </p>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter reason..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "16px",
                  fontSize: "0.9rem"
                }}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setRefundModal({ show: false, donationId: null });
                    setRefundReason("");
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefundRequest}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyDonations;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import RatingStars from "./RatingStars";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/campaign.css";

const CampaignsList = () => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userDonations, setUserDonations] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/campaigns?status=approved`)
      .then(r => r.json())
      .then(d => { setCampaigns(d.campaigns || []); setLoading(false); })
      .catch(() => { setError("Failed to load campaigns"); setLoading(false); });
    
    // Fetch user's donations if logged in
    if (token) {
      fetch(`${API_URL}/api/donations/user/my-donations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(d => {
          if (d.donations) {
            setUserDonations(d.donations.map(donation => donation.campaign?._id || donation.campaign));
          }
        })
        .catch(err => console.error("Failed to fetch donations:", err));
    }
  }, [token]);

  const handleRating = async (campaignId, rating) => {
    if (!token) {
      toast.error("Please login to rate");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/campaigns/${campaignId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Rating submitted!");
        // Update campaign rating in local state
        setCampaigns(campaigns.map(c => 
          c._id === campaignId 
            ? { ...c, averageRating: data.averageRating, totalRatings: data.totalRatings }
            : c
        ));
      }
    } catch (error) {
      toast.error("Error submitting rating");
    }
  };

  const handleHomeClick = () => {
    const role = sessionStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "creator") {
      navigate("/creator-dashboard");
    } else if (role === "user") {
      navigate("/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Explore Campaigns</h2>
          <button onClick={handleHomeClick} className="btn btn-secondary">
            Home
          </button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {campaigns.length === 0 ? (
          <p style={{ textAlign: "center" }}>No campaigns</p>
        ) : (
          <div className="campaigns-container">
            {campaigns.map((c) => {
              const hasDonated = userDonations.includes(c._id);
              
              return (
              <div key={c._id} className="campaign-card">
                {/* <div className="campaign-image">🎯</div> */}
                <div className="campaign-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h3 className="campaign-title">{c.title}</h3>
                    {c.totalRatings > 0 && (
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        ({c.totalRatings} {c.totalRatings === 1 ? "rating" : "ratings"})
                      </span>
                    )}
                  </div>
                  
                  {/* Show rating stars */}
                  <div style={{ marginBottom: "12px" }}>
                    {hasDonated ? (
                      <div>
                        <RatingStars 
                          rating={c.averageRating || 0} 
                          onRate={(rating) => handleRating(c._id, rating)}
                          readOnly={false}
                          size="small"
                        />
                        <p style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>
                          ✓ You can rate this campaign
                        </p>
                      </div>
                    ) : (
                      <div>
                        <RatingStars 
                          rating={c.averageRating || 0} 
                          readOnly={true}
                          size="small"
                        />
                        {token && (
                          <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
                            Donate to rate this campaign
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="campaign-description">{c.description.substring(0, 100)}</p>
                  <p className="campaign-creator">by {c.creatorName}</p>
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min((c.currentAmount / c.targetAmount) * 100, 100)}%` }} />
                    </div>
                    <div className="progress-text">₹{c.currentAmount} of ₹{c.targetAmount}</div>
                  </div>
                </div>
                <div className="campaign-footer">
                  {userRole === "user" && (
                    <button onClick={() => navigate(`/campaign/${c._id}/donate`)} className="btn btn-primary campaign-button">
                      Donate
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
      </main>
    </div>
  );
};

export default CampaignsList;

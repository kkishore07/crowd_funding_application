import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import RatingStars from "./RatingStars";
import CampaignQRCode from "./CampaignQRCode";
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
      .then((r) => r.json())
      .then((d) => {
        setCampaigns(d.campaigns || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load campaigns");
        setLoading(false);
      });

    if (token) {
      fetch(`${API_URL}/api/donations/user/my-donations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.donations) {
            setUserDonations(
              d.donations.map((donation) => donation.campaign?._id || donation.campaign)
            );
          }
        })
        .catch((err) => console.error("Failed to fetch donations:", err));
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
        setCampaigns(
          campaigns.map((c) =>
            c._id === campaignId
              ? { ...c, averageRating: data.averageRating, totalRatings: data.totalRatings }
              : c
          )
        );
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
    <div className="dashboard-container explore-page">
      <main className="dashboard-main">
        <section className="explore-hero">
          <div>
            <p className="explore-kicker">Discover</p>
            <h2 className="explore-title">Explore Campaigns</h2>
            <p className="explore-subtitle">
              Find trusted causes and support the ones that resonate with you.
            </p>
          </div>
          <button onClick={handleHomeClick} className="btn btn-secondary">
            Home
          </button>
        </section>

        {error && <div className="alert alert-error">{error}</div>}

        {campaigns.length === 0 ? (
          <p className="explore-empty">No campaigns</p>
        ) : (
          <section className="explore-grid">
            {campaigns.map((c) => {
              const hasDonated = userDonations.includes(c._id);
              const isTargetReached = c.currentAmount >= c.targetAmount;

              return (
                <div key={c._id} className="explore-card">
                  <div className="explore-card-media">
                    {c.image ? (
                      <img
                        src={`${API_URL}/uploads/${c.image}`}
                        alt={c.title}
                        className="explore-card-image"
                      />
                    ) : (
                      <div className="explore-card-image explore-card-placeholder">🎯</div>
                    )}
                    {isTargetReached && <span className="explore-chip">Target Reached</span>}
                  </div>
                  <div className="explore-card-body">
                    <div className="explore-card-header">
                      <h3>{c.title}</h3>
                      {c.totalRatings > 0 && (
                        <span className="explore-rating-count">
                          {c.totalRatings} {c.totalRatings === 1 ? "rating" : "ratings"}
                        </span>
                      )}
                    </div>

                    <div className="explore-rating">
                      {hasDonated ? (
                        <div>
                          <RatingStars
                            rating={c.averageRating || 0}
                            onRate={(rating) => handleRating(c._id, rating)}
                            readOnly={false}
                            size="small"
                          />
                          <p className="explore-rating-hint explore-rating-ok">
                            You can rate this campaign
                          </p>
                        </div>
                      ) : (
                        <div>
                          <RatingStars rating={c.averageRating || 0} readOnly size="small" />
                          {token && (
                            <p className="explore-rating-hint">Donate to rate this campaign</p>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="explore-description">{c.description.substring(0, 100)}</p>
                    <p className="explore-creator">by {c.creatorName}</p>

                    <div className="explore-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min((c.currentAmount / c.targetAmount) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="progress-text">₹{c.currentAmount} of ₹{c.targetAmount}</div>
                    </div>

                    <div className="explore-actions">
                      {userRole === "user" && (
                        <button
                          onClick={() => navigate(`/campaign/${c._id}/donate`)}
                          className="btn btn-primary"
                          disabled={isTargetReached}
                        >
                          {isTargetReached ? "Target Reached" : "Donate"}
                        </button>
                      )}
                      <CampaignQRCode campaignId={c._id} campaignTitle={c.title} />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
      </main>
    </div>
  );
};

export default CampaignsList;

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(GlobalContext);
  const userName = user?.name || sessionStorage.getItem("userName");

  return (
    <div className="dashboard-container creator-dashboard">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <div className="dashboard-nav-top">
            <h1 className="dashboard-logo">CrowdFunding</h1>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">Welcome, <strong>{userName}</strong></span>
              <span className="dashboard-badge dashboard-badge-creator">Creator</span>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main creator-dashboard-main">
        <section className="creator-hero">
          <div>
            <p className="creator-hero-tag">Creator Workspace</p>
            <h2 className="creator-hero-title">Build campaigns that inspire change.</h2>
            <p className="creator-hero-subtitle">Launch new campaigns, monitor progress, and share your impact with supporters.</p>
            <div className="creator-hero-actions">
              <button className="btn btn-primary" onClick={() => navigate("/create-campaign")}>
                Create Campaign
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/active-campaigns")}>
                Manage Campaigns
              </button>
            </div>
          </div>
          <div className="creator-hero-card">
            <div className="creator-hero-icon">🚀</div>
            <div>
              <p className="creator-hero-card-title">Keep momentum high</p>
              <p className="creator-hero-card-text">Stay on top of approvals and performance insights.</p>
            </div>
          </div>
        </section>

        <section className="creator-action-grid">
          <button className="creator-action-card" onClick={() => navigate("/create-campaign")} type="button">
            <span className="creator-action-icon">✨</span>
            <span>
              <strong>Create Campaign</strong>
              <small>Start something new</small>
            </span>
          </button>
          <button className="creator-action-card" onClick={() => navigate("/active-campaigns")} type="button">
            <span className="creator-action-icon">📋</span>
            <span>
              <strong>Active Campaigns</strong>
              <small>Manage live campaigns</small>
            </span>
          </button>
          <button className="creator-action-card" onClick={() => navigate("/active-campaigns")} type="button">
            <span className="creator-action-icon">⏳</span>
            <span>
              <strong>Pending Approval</strong>
              <small>Await admin review</small>
            </span>
          </button>
          <button className="creator-action-card" onClick={() => navigate("/analytics")} type="button">
            <span className="creator-action-icon">📊</span>
            <span>
              <strong>Analytics</strong>
              <small>View performance</small>
            </span>
          </button>
          <button className="creator-action-card" onClick={() => navigate("/campaigns")} type="button">
            <span className="creator-action-icon">🔍</span>
            <span>
              <strong>Browse Campaigns</strong>
              <small>Explore all campaigns</small>
            </span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default CreatorDashboard;

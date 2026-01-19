import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(GlobalContext);
  const userName = user?.name || sessionStorage.getItem("userName");

  return (
    <div className="dashboard-container">
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

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Creator Dashboard</h2>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/create-campaign")}>
            <div className="dashboard-card-icon dashboard-card-icon-primary">✨</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Create Campaign</h3>
              <p className="dashboard-card-description">Start a new campaign</p>
            </div>
            <button className="dashboard-card-button">Create</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/active-campaigns")}>
            <div className="dashboard-card-icon dashboard-card-icon-success">📋</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Active Campaigns</h3>
              <p className="dashboard-card-description">Manage live campaigns</p>
            </div>
            <button className="dashboard-card-button">View</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/active-campaigns")}>
            <div className="dashboard-card-icon dashboard-card-icon-primary">⏳</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Pending Approval</h3>
              <p className="dashboard-card-description">Awaiting admin review</p>
            </div>
            <button className="dashboard-card-button">Check</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/analytics")}>
            <div className="dashboard-card-icon dashboard-card-icon-purple">📊</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Analytics</h3>
              <p className="dashboard-card-description">View performance</p>
            </div>
            <button className="dashboard-card-button">View</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/campaigns")}>
            <div className="dashboard-card-icon dashboard-card-icon-orange">🔍</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Browse Campaigns</h3>
              <p className="dashboard-card-description">Explore all campaigns</p>
            </div>
            <button className="dashboard-card-button">
              Browse
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;

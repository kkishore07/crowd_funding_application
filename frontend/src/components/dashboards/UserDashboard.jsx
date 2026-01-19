import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

const UserDashboard = () => {
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
              <span className="dashboard-badge dashboard-badge-user">Donor</span>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Donor Dashboard</h2>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/campaigns")}>
            <div className="dashboard-card-icon dashboard-card-icon-primary">🔍</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Browse Campaigns</h3>
              <p className="dashboard-card-description">Discover amazing projects to support</p>
            </div>
            <button className="dashboard-card-button">Explore</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/my-donations")}>
            <div className="dashboard-card-icon dashboard-card-icon-success">💳</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">My Donations</h3>
              <p className="dashboard-card-description">Track your contributions</p>
            </div>
            <button className="dashboard-card-button">View</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/profile")}>
            <div className="dashboard-card-icon dashboard-card-icon-purple">👤</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">My Profile</h3>
              <p className="dashboard-card-description">Update your personal information and account preferences.</p>
            </div>
            <button className="dashboard-card-button">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;

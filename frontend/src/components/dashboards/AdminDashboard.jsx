import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../../context/GlobalContext";

const AdminDashboard = () => {
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
              <span className="dashboard-badge dashboard-badge-admin">Admin</span>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Admin Dashboard</h2>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/manage-users")}>
            <div className="dashboard-card-icon dashboard-card-icon-primary">👥</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Manage Users</h3>
              <p className="dashboard-card-description">View and manage all users</p>
            </div>
            <button className="dashboard-card-button">Manage</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/campaigns")}>
            <div className="dashboard-card-icon dashboard-card-icon-success">📊</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">All Campaigns</h3>
              <p className="dashboard-card-description">Review all campaigns</p>
            </div>
            <button className="dashboard-card-button">View</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/campaign-approval")}>
            <div className="dashboard-card-icon dashboard-card-icon-purple">✅</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Pending Approval</h3>
              <p className="dashboard-card-description">Review & approve campaigns</p>
            </div>
            <button className="dashboard-card-button">Review</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/refund-requests")}>
            <div className="dashboard-card-icon dashboard-card-icon-warning">💰</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Refund Requests</h3>
              <p className="dashboard-card-description">Process pending refunds</p>
            </div>
            <button className="dashboard-card-button">Process</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/suspicious-donations")}>
            <div className="dashboard-card-icon dashboard-card-icon-danger">⚠️</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Suspicious Activity</h3>
              <p className="dashboard-card-description">Review flagged donations</p>
            </div>
            <button className="dashboard-card-button">Review</button>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/settings")}>
            <div className="dashboard-card-icon dashboard-card-icon-orange">⚙️</div>
            <div className="dashboard-card-content">
              <h3 className="dashboard-card-title">Settings</h3>
              <p className="dashboard-card-description">Configure platform.</p>
            </div>
            <button className="dashboard-card-button">
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

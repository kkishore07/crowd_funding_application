import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalContext from "../context/GlobalContext";
import "../styles/campaign.css";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user, handleCreateCampaign } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    endDate: "",
  });

  if (!user || (user.role !== "creator" && user.role !== "admin")) {
    return <div className="dashboard-container"><p className="alert alert-error">Creators only</p></div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.targetAmount || !formData.endDate) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);
    const result = await handleCreateCampaign(formData);
    
    if (result.ok) {
      toast.success("Campaign created! Awaiting approval.");
      setTimeout(() => navigate("/creator-dashboard"), 800);
    } else {
      toast.error(result.message || "Failed to create campaign");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Create Campaign</h2>
        </div>
        <div className="campaign-form-container">
          <form onSubmit={handleSubmit} className="campaign-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Campaign title" required />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input" placeholder="Describe your campaign" rows="4" required />
            </div>
            <div className="form-group">
              <label className="form-label">Target Amount (₹) *</label>
              <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} className="input" placeholder="10000" min="1" required />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input" required />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
                {loading ? "Creating..." : "Create Campaign"}
              </button>
              <button type="button" onClick={() => navigate("/creator-dashboard")} className="btn btn-secondary btn-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CreateCampaign;

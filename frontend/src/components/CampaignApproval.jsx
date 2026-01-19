import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalContext from "../context/GlobalContext";
import "../styles/campaign.css";

const CampaignApproval = () => {
  const { user, campaigns, handleApproveCampaign, setCampaigns, loading, fetchCampaigns } = useContext(GlobalContext);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [reason, setReason] = useState("");
  const [rejectId, setRejectId] = useState(null);

  if (!user || user.role !== "admin") {
    return <div className="dashboard-container"><p className="alert alert-error">Admins only</p></div>;
  }

  // Refetch campaigns when component mounts
  useEffect(() => {
    if (fetchCampaigns) {
      fetchCampaigns();
    }
  }, []);

  useEffect(() => {
    setPendingCampaigns(campaigns.filter(c => c.status === "pending"));
  }, [campaigns]);

  const approve = async (id) => {
    const result = await handleApproveCampaign(id);
    if (result.ok) {
      toast.success("Campaign approved!");
      setPendingCampaigns(pendingCampaigns.filter(c => c._id !== id));
    } else {
      toast.error("Approve failed");
    }
  };

  const reject = async (id) => {
    if (!reason.trim()) {
      toast.error("Reason required");
      return;
    }
    
    try {
      const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000";
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/campaigns/${id}/reject`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ rejectionReason: reason })
      });
      
      if (res.ok) {
        toast.success("Campaign rejected");
        setPendingCampaigns(pendingCampaigns.filter(c => c._id !== id));
        setCampaigns(campaigns.filter(c => c._id !== id));
        setRejectId(null);
        setReason("");
      } else {
        toast.error("Reject failed");
      }
    } catch (error) {
      toast.error("Error rejecting campaign");
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading...</p></div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Campaign Approval</h2>
        </div>
        {pendingCampaigns.length === 0 ? (
          <p style={{ textAlign: "center" }}>No pending campaigns</p>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {pendingCampaigns.map((c) => (
              <div key={c._id} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "16px" }}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <p><small>by {c.creatorName}</small></p>
                <p>Target: ₹{c.targetAmount}</p>
                {rejectId === c._id ? (
                  <div style={{ marginTop: "12px" }}>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason" style={{ width: "100%", padding: "8px" }} />
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                      <button onClick={() => reject(c._id)} className="btn btn-danger">Submit</button>
                      <button onClick={() => { setRejectId(null); setReason(""); }} className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    <button onClick={() => approve(c._id)} className="btn btn-primary">Approve</button>
                    <button onClick={() => setRejectId(c._id)} className="btn btn-secondary">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CampaignApproval;

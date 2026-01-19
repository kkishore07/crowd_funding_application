import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserDashboard from "./components/dashboards/UserDashboard";
import CreatorDashboard from "./components/dashboards/CreatorDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import CreateCampaign from "./components/CreateCampaign";
import CampaignsList from "./components/CampaignsList";
import CampaignApproval from "./components/CampaignApproval";
import Donate from "./components/Donate";
import MyDonations from "./components/MyDonations";
import ActiveCampaigns from "./components/ActiveCampaigns";
import Analytics from "./components/Analytics";
import RefundRequests from "./components/RefundRequests";
import SuspiciousDonations from "./components/SuspiciousDonations";
import ProtectedRoute from "./components/ProtectedRoute";
import { GlobalProvider } from "./context/GlobalContext";
import "./App.css";

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/creator-dashboard" 
            element={
              <ProtectedRoute>
                <CreatorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns" 
            element={
              <ProtectedRoute>
                <CampaignsList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-campaign" 
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaign-approval" 
            element={
              <ProtectedRoute>
                <CampaignApproval />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaign/:campaignId/donate" 
            element={
              <ProtectedRoute>
                <Donate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-donations" 
            element={
              <ProtectedRoute>
                <MyDonations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/active-campaigns" 
            element={
              <ProtectedRoute>
                <ActiveCampaigns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/refund-requests" 
            element={
              <ProtectedRoute>
                <RefundRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/suspicious-donations" 
            element={
              <ProtectedRoute>
                <SuspiciousDonations />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;

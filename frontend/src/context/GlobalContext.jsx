import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import { isTokenValid } from "../utils/auth";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialize user from session storage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    const role = sessionStorage.getItem("role");

    if (token && isTokenValid(token)) {
      setUser({ id: userId, name: userName, role, token });
    }
  }, []);

  // Fetch campaigns on initial load
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Function to fetch/refetch campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/api/campaigns`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("isLoggedin", "true");
        sessionStorage.setItem("role", result.user.role);
        sessionStorage.setItem("userName", result.user.name);
        sessionStorage.setItem("userId", result.user.id);

        setUser({
          id: result.user.id,
          name: result.user.name,
          role: result.user.role,
          token: result.token,
        });

        return { ok: true, user: result.user };
      } else {
        return { ok: false, message: result.message || "Invalid credentials" };
      }
    } catch (error) {
      return { ok: false, message: "Login failed. Please check your connection." };
    }
  };

  // Handle user registration
  const handleRegister = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        return { ok: true, message: "Registration successful! Please login." };
      } else {
        return { ok: false, message: result.message || "Registration failed" };
      }
    } catch (error) {
      return { ok: false, message: "Registration failed. Please try again." };
    }
  };

  // Handle user logout
  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setCampaigns([]);
    setDonations([]);
    navigate("/login");
  };

  // Fetch user's donations
  const fetchMyDonations = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        handleLogout();
        return [];
      }

      const response = await fetch(`${API_URL}/api/donations/my-donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDonations(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching donations:", error);
      return [];
    }
  };

  // Create a new campaign
  const handleCreateCampaign = async (campaignData) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        handleLogout();
        return { ok: false, message: "Please login to create a campaign" };
      }

      console.log("Creating campaign with data:", campaignData);
      console.log("API URL:", `${API_URL}/api/campaigns`);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await fetch(`${API_URL}/api/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaignData),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        const updatedCampaigns = Array.isArray(campaigns) ? [...campaigns, result.campaign] : [result.campaign];
        setCampaigns(updatedCampaigns);
        return { ok: true, campaign: result.campaign };
      } else {
        return { ok: false, message: result.message || "Failed to create campaign" };
      }
    } catch (error) {
      console.error("Caught error:", error);
      return { ok: false, message: "Error creating campaign: " + error.message };
    }
  };

  // Make a donation
  const handleDonate = async (campaignId, amount, message) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        handleLogout();
        return { ok: false, message: "Please login to donate" };
      }

      const response = await fetch(`${API_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId, amount, message }),
      });

      const result = await response.json();

      if (response.ok) {
        return { ok: true, donation: result };
      } else {
        return { ok: false, message: result.message || "Failed to make donation" };
      }
    } catch (error) {
      return { ok: false, message: "Error making donation" };
    }
  };

  // Approve campaign (admin only)
  const handleApproveCampaign = async (campaignId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token || !isTokenValid(token)) {
        handleLogout();
        return { ok: false };
      }

      const response = await fetch(`${API_URL}/api/campaigns/${campaignId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Refetch all campaigns to ensure consistency
        await fetchCampaigns();
        return { ok: true };
      }
      return { ok: false };
    } catch (error) {
      return { ok: false };
    }
  };

  const value = {
    campaigns,
    donations,
    loading,
    user,
    setCampaigns,
    fetchCampaigns,
    handleLogin,
    handleRegister,
    handleLogout,
    fetchMyDonations,
    handleCreateCampaign,
    handleDonate,
    handleApproveCampaign,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
export default GlobalContext;

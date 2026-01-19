import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalContext from "../context/GlobalContext";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, handleRegister } = useContext(GlobalContext);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      toast.error("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const result = await handleLogin(email, password);

      if (result.ok) {
        toast.success("Login successful! Redirecting...");
        const role = result.user.role;
        const redirectPath = role === "creator" ? "/creator-dashboard" : role === "admin" ? "/admin-dashboard" : "/user-dashboard";
        setTimeout(() => {
          navigate(redirectPath);
        }, 800);
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const role = roleRef.current.value;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await handleRegister({ name, email, password, role });

      if (result.ok) {
        toast.success("Registration successful! Please login.");
        setTimeout(() => {
          setIsRegisterMode(false);
          emailRef.current.value = "";
          passwordRef.current.value = "";
        }, 2000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">
            {isRegisterMode ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="auth-subtitle">
            {isRegisterMode
              ? "Join our crowdfunding community"
              : "Sign in to continue to your account"}
          </p>
        </div>

        <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleSubmit}>
          {/* Name Field (Register only) */}
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                ref={nameRef}
                className="input"
                placeholder="Manoj"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>
            <input
              type="email"
              ref={emailRef}
              className="input"
              placeholder="your.email@gmail.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">
              Password
            </label>
            <input
              type="password"
              ref={passwordRef}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {/* Role Field (Register only) */}
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">
                Register As
              </label>
              <select
                ref={roleRef}
                defaultValue="user"
                className="input"
              >
                <option value="user">Donor (Support campaigns)</option>
                <option value="creator">Creator (Start campaigns)</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? "Processing..." : isRegisterMode ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="auth-footer">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
            }}
            className="auth-toggle"
          >
            {isRegisterMode ? (
              <>
                Already have an account?{" "}
                <span>Sign In</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span>Create One</span>
              </>
            )}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;

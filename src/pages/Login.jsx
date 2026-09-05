import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowRight, Leaf, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/account");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 72px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "linear-gradient(180deg, var(--color-bg-alt), var(--color-bg))",
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            marginBottom: "1rem",
            boxShadow: "0 8px 24px rgba(26,58,46,0.2)",
          }}>
            <Leaf size={28} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
            Sign in to your SYNGEn account
          </p>
        </div>

        <div className="card" style={{
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          animation: "scaleIn 0.4s ease",
        }}>
          {error && <div className="error-banner"><AlertCircle size={16} /> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: "2.75rem" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: "2.75rem" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ borderRadius: "10px", width: "100%", marginTop: "0.5rem" }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9375rem",
            color: "var(--color-text-muted)",
          }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-accent)"}
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock, ArrowRight, Leaf, AlertCircle } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate("/account");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
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
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Create Account</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem" }}>
            Join SYNGEn GREEN ARCHITECH today
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
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)",
                }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: "2.75rem" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
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
                <><span className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9375rem",
            color: "var(--color-text-muted)",
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-accent)"}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Edit,
  Save,
  X,
  TrendingUp,
} from "lucide-react";

const BUCKET_NAME = "product-images";

function getProductImage(imageName) {
  if (!imageName) return null;
  const cleanName = String(imageName).trim().replace(/^\/+/, "");
  if (!cleanName) return null;
  if (cleanName.startsWith("http://") || cleanName.startsWith("https://")) return cleanName;
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(cleanName);
  return data?.publicUrl || null;
}

export default function Account() {
  const { user, profile, logout, refreshProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    phone: profile?.phone || "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
      setEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }



  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "4rem", background: "var(--color-bg-alt)", minHeight: "calc(100vh - 72px)" }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "2.5rem",
          marginBottom: "1.5rem",
          border: "1px solid var(--color-border-soft)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,139,111,0.06), transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              flexShrink: 0,
            }}>
              {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0.25rem" }}>
                {profile?.name || "User"}
              </h1>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>
                {user.email}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="badge badge-active" style={{ textTransform: "capitalize" }}>
                  {profile?.role || "customer"}
                </span>
                {isAdmin && <span className="badge badge-new">Admin Access</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm" style={{ borderRadius: "8px" }}>
                  <Edit size={16} /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm" style={{ borderRadius: "8px" }}>
                    {saving ? <><span className="spinner" style={{ width: "14px", height: "14px", borderWidth: "2px" }} /> Saving...</> : <><Save size={16} /> Save</>}
                  </button>
                  <button onClick={() => { setEditing(false); setFormData({ name: profile?.name || "", phone: profile?.phone || "" }); }} className="btn btn-ghost btn-sm" style={{ borderRadius: "8px" }}>
                    <X size={16} /> Cancel
                  </button>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ borderRadius: "8px" }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {error && <div className="error-banner" style={{ marginTop: "1.5rem" }}>{error}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Profile details */}
          <div className="card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}>
              Profile Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  <User size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.125rem" }}>
                    Full Name
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: "0.5rem 0.75rem", fontSize: "0.9375rem" }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text)" }}>
                      {profile?.name || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  <Mail size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.125rem" }}>
                    Email
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text)" }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  <Phone size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.125rem" }}>
                    Phone
                  </div>
                  {editing ? (
                    <input
                      type="tel"
                      className="form-input"
                      style={{ padding: "0.5rem 0.75rem", fontSize: "0.9375rem" }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text)" }}>
                      {profile?.phone || "Not set"}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-accent)",
                  flexShrink: 0,
                }}>
                  <TrendingUp size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: "0.125rem" }}>
                    Role
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--color-text)", textTransform: "capitalize" }}>
                    {profile?.role || "customer"}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

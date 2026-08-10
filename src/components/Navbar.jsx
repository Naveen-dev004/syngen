import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Leaf,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/cart", label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}` },
    { to: "/orders", label: "Orders" },
    { to: "/account", label: "Account" },
  ];

  return (
    <>
      <header
        className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid var(--color-border-soft)" : "1px solid transparent",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(26,58,46,0.2)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(-5deg) scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0) scale(1)"}
            >
              <Leaf size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "1.125rem",
                color: "var(--color-primary)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}>
                SYNGEn
              </div>
              <div style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "var(--color-accent)",
                textTransform: "uppercase",
              }}>
                GREEN ARCHITECH
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to.split("?")[0] && !link.to.includes("?");
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-link"
                  style={{
                    padding: "0.5rem 0.875rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-primary)";
                    e.currentTarget.style.background = "var(--color-accent-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isActive ? "var(--color-primary)" : "var(--color-text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="nav-link"
                style={{
                  padding: "0.5rem 0.875rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-accent-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Sparkles size={14} />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.875rem",
                    borderRadius: "100px",
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface)",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}>
                    {profile?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text)" }}>
                    {profile?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: userMenuOpen ? "rotate(180deg)" : "none" }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setUserMenuOpen(false)} />
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 0.5rem)",
                      width: "220px",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      padding: "0.5rem",
                      zIndex: 99,
                      animation: "slideDown 0.2s ease",
                    }}>
                      <Link to="/account" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-text)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-accent-soft)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <User size={16} /> My Account
                      </Link>
                      <Link to="/orders" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-text)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-accent-soft)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                          padding: "0.625rem 0.875rem",
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--color-accent)",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-accent-soft)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Sparkles size={16} /> Admin Panel
                        </Link>
                      )}
                      <div style={{ height: "1px", background: "var(--color-border)", margin: "0.375rem 0" }} />
                      <button onClick={handleLogout} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.625rem 0.875rem",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-error)",
                        width: "100%",
                        textAlign: "left",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ borderRadius: "8px" }}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ borderRadius: "8px" }}>Register</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                padding: "0.5rem",
                borderRadius: "8px",
                color: "var(--color-primary)",
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(20px)",
          zIndex: 99,
          padding: "2rem",
          overflowY: "auto",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: "1rem 1.25rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                {link.label === "Cart" && <ShoppingCart size={18} />}
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-accent)",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-accent-soft)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}>
                <Sparkles size={18} /> Admin Panel
              </Link>
            )}
            {user && (
              <button onClick={handleLogout} style={{
                padding: "1rem 1.25rem",
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-error)",
                borderRadius: "var(--radius-sm)",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                textAlign: "left",
              }}>
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}

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
  Sparkles,
  ChevronDown,
} from "lucide-react";

import syngenLogo from "@/assets/syngen-logo.png.png";

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // SCROLL EFFECT
  // =========================================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // =========================================================
  // CLOSE MENUS WHEN PAGE CHANGES
  // =========================================================

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // =========================================================
  // NAVIGATION LINKS
  // =========================================================

  const navLinks = [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/products",
      label: "Products",
    },
    {
      to: "/cart",
      label: `Cart${cartCount > 0 ? ` (${cartCount})` : ""}`,
    },
    {
      to: "/orders",
      label: "Orders",
    },
    {
      to: "/account",
      label: "Account",
    },
  ];

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,

          background: scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.94)",

          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",

          borderBottom: scrolled
            ? "1px solid var(--color-border-soft)"
            : "1px solid transparent",

          transition:
            "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            height: "72px",

            gap: "20px",
          }}
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",

              flexShrink: 0,

              textDecoration: "none",
            }}
          >
            <img
              src={syngenLogo}
              alt="Syngen Green Agritech"
              style={{
                width: "190px",
                height: "55px",

                objectFit: "contain",
                objectPosition: "left center",

                display: "block",
              }}
            />
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div
            className="nav-links-desktop"
            style={{
              display: "flex",
              alignItems: "center",

              gap: "0.25rem",
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to;

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

                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",

                    borderRadius: "8px",

                    transition: "all 0.2s",

                    position: "relative",

                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      "var(--color-primary)";

                    e.currentTarget.style.background =
                      "var(--color-accent-soft)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      isActive
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)";

                    e.currentTarget.style.background =
                      "transparent";
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* =================================================
                ADMIN LINK
            ================================================= */}

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

                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-accent-soft)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                <Sparkles size={14} />

                Admin Panel
              </Link>
            )}
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "0.75rem",
            }}
          >
            {/* =================================================
                LOGGED IN USER
            ================================================= */}

            {user ? (
              <div
                style={{
                  position: "relative",
                }}
              >
                {/* USER BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setUserMenuOpen(
                      !userMenuOpen
                    )
                  }
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "0.5rem",

                    padding:
                      "0.5rem 0.875rem",

                    borderRadius: "100px",

                    border:
                      "1.5px solid var(--color-border)",

                    background:
                      "var(--color-surface)",

                    transition: "all 0.2s",

                    cursor: "pointer",
                  }}
                >
                  {/* USER AVATAR */}

                  <div
                    style={{
                      width: "28px",

                      height: "28px",

                      borderRadius: "50%",

                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-accent))",

                      color: "white",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      fontSize: "0.75rem",

                      fontWeight: 700,
                    }}
                  >
                    {profile?.name?.[0]?.toUpperCase() ||
                      user.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>

                  {/* USER NAME */}

                  <span
                    style={{
                      fontSize: "0.8125rem",

                      fontWeight: 600,

                      color:
                        "var(--color-text)",
                    }}
                  >
                    {profile?.name?.split(" ")[0] ||
                      "Account"}
                  </span>

                  <ChevronDown
                    size={14}
                    style={{
                      transition:
                        "transform 0.2s",

                      transform:
                        userMenuOpen
                          ? "rotate(180deg)"
                          : "none",
                    }}
                  />
                </button>

                {/* =================================================
                    USER DROPDOWN
                ================================================= */}

                {userMenuOpen && (
                  <>
                    {/* BACKDROP */}

                    <div
                      style={{
                        position: "fixed",

                        inset: 0,

                        zIndex: 998,
                      }}
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                    />

                    {/* DROPDOWN */}

                    <div
                      style={{
                        position: "absolute",

                        right: 0,

                        top:
                          "calc(100% + 0.5rem)",

                        width: "220px",

                        background:
                          "var(--color-surface)",

                        border:
                          "1px solid var(--color-border)",

                        borderRadius:
                          "var(--radius-md)",

                        boxShadow:
                          "var(--shadow-lg)",

                        padding: "0.5rem",

                        zIndex: 999,

                        animation:
                          "slideDown 0.2s ease",
                      }}
                    >
                      {/* ACCOUNT */}

                      <Link
                        to="/account"
                        style={{
                          display: "flex",

                          alignItems: "center",

                          gap: "0.625rem",

                          padding:
                            "0.625rem 0.875rem",

                          borderRadius: "8px",

                          fontSize: "0.875rem",

                          fontWeight: 500,

                          color:
                            "var(--color-text)",

                          transition:
                            "background 0.15s",

                          textDecoration:
                            "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-accent-soft)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "transparent")
                        }
                      >
                        <User size={16} />

                        My Account
                      </Link>

                      {/* ORDERS */}

                      <Link
                        to="/orders"
                        style={{
                          display: "flex",

                          alignItems: "center",

                          gap: "0.625rem",

                          padding:
                            "0.625rem 0.875rem",

                          borderRadius: "8px",

                          fontSize: "0.875rem",

                          fontWeight: 500,

                          color:
                            "var(--color-text)",

                          transition:
                            "background 0.15s",

                          textDecoration:
                            "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-accent-soft)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "transparent")
                        }
                      >
                        <Package size={16} />

                        My Orders
                      </Link>

                      {/* ADMIN */}

                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{
                            display: "flex",

                            alignItems: "center",

                            gap: "0.625rem",

                            padding:
                              "0.625rem 0.875rem",

                            borderRadius: "8px",

                            fontSize: "0.875rem",

                            fontWeight: 500,

                            color:
                              "var(--color-accent)",

                            transition:
                              "background 0.15s",

                            textDecoration:
                              "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "var(--color-accent-soft)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "transparent")
                          }
                        >
                          <Sparkles size={16} />

                          Admin Panel
                        </Link>
                      )}

                      {/* SEPARATOR */}

                      <div
                        style={{
                          height: "1px",

                          background:
                            "var(--color-border)",

                          margin:
                            "0.375rem 0",
                        }}
                      />

                      {/* LOGOUT */}

                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        style={{
                          display: "flex",

                          alignItems: "center",

                          gap: "0.625rem",

                          padding:
                            "0.625rem 0.875rem",

                          borderRadius: "8px",

                          fontSize: "0.875rem",

                          fontWeight: 500,

                          color:
                            "var(--color-error)",

                          width: "100%",

                          textAlign: "left",

                          transition:
                            "background 0.15s",

                          cursor: "pointer",

                          border: "none",

                          background:
                            "transparent",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "#fef2f2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "transparent")
                        }
                      >
                        <LogOut size={16} />

                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* =================================================
                 NOT LOGGED IN
              ================================================= */

              <div
                style={{
                  display: "flex",

                  gap: "0.5rem",
                }}
              >
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  Register
                </Link>
              </div>
            )}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              style={{
                display: "none",

                padding: "0.5rem",

                borderRadius: "8px",

                color:
                  "var(--color-primary)",

                cursor: "pointer",

                border: "none",

                background: "transparent",
              }}
            >
              {mobileOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      {mobileOpen && (
        <div
          style={{
            position: "fixed",

            top: "72px",

            left: 0,

            right: 0,

            bottom: 0,

            background:
              "rgba(255,255,255,0.98)",

            backdropFilter:
              "blur(20px)",

            WebkitBackdropFilter:
              "blur(20px)",

            zIndex: 999,

            padding: "2rem",

            overflowY: "auto",

            animation:
              "fadeIn 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",

              flexDirection: "column",

              gap: "0.5rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding:
                    "1rem 1.25rem",

                  fontSize: "1rem",

                  fontWeight: 600,

                  color:
                    "var(--color-primary)",

                  borderRadius:
                    "var(--radius-sm)",

                  background:
                    "var(--color-accent-soft)",

                  display: "flex",

                  alignItems: "center",

                  gap: "0.75rem",

                  textDecoration: "none",
                }}
              >
                {link.label.startsWith("Cart") && (
                  <ShoppingCart
                    size={18}
                  />
                )}

                {link.label}
              </Link>
            ))}

            {/* ADMIN */}

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  padding:
                    "1rem 1.25rem",

                  fontSize: "1rem",

                  fontWeight: 600,

                  color:
                    "var(--color-accent)",

                  borderRadius:
                    "var(--radius-sm)",

                  background:
                    "var(--color-accent-soft)",

                  display: "flex",

                  alignItems: "center",

                  gap: "0.75rem",

                  textDecoration: "none",
                }}
              >
                <Sparkles size={18} />

                Admin Panel
              </Link>
            )}

            {/* LOGOUT */}

            {user && (
              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={{
                  padding:
                    "1rem 1.25rem",

                  fontSize: "1rem",

                  fontWeight: 600,

                  color:
                    "var(--color-error)",

                  borderRadius:
                    "var(--radius-sm)",

                  background: "#fef2f2",

                  display: "flex",

                  alignItems: "center",

                  gap: "0.75rem",

                  textAlign: "left",

                  border: "none",

                  cursor: "pointer",
                }}
              >
                <LogOut size={18} />

                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          RESPONSIVE
      ========================================================= */}

      <style>{`
        @media (max-width: 1024px) {
          .nav-links-desktop {
            display: none !important;
          }

          .mobile-menu-toggle {
            display: block !important;
          }
        }

        @media (max-width: 600px) {
          .navbar .container {
            height: 64px !important;
          }

          .navbar img {
            width: 155px !important;
            height: 48px !important;
          }

          .navbar {
            min-height: 64px;
          }
        }
      `}</style>
    </>
  );
}
